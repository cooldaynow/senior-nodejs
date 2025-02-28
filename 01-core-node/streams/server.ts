import http, { IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import { pipeline, Transform, Writable } from 'node:stream';
import fs from 'node:fs';
import fspromises from 'node:fs/promises';
import path from 'node:path';
import StreamArray from 'stream-json/streamers/StreamArray';
import crypto from 'node:crypto';

const getJSONError = (params: { statusCode: number; message: string }) => JSON.stringify(params);

const responseJSONError = (params: { message: string; statusCode?: number }, res: ServerResponse) => {
  const { statusCode = 400, message } = params;
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(getJSONError({ statusCode, message }));
};

const genFilePath = (p: string) => path.join(__dirname, p);

const checkFileExistOrFail = async (filePath: string, res: ServerResponse<http.IncomingMessage>) => {
  try {
    await fspromises.stat(filePath);
  } catch (e) {
    responseJSONError({ message: `File not found: ${filePath}` }, res);
  }
};

/* 100MB для теста */
const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;
const uploadFile: RequestListener = (req, res) => {
  const fileName = crypto.randomUUID();
  const filePath = path.join(__dirname, fileName);
  const writeStream = fs.createWriteStream(filePath);
  const contentLength = req.headers['content-length'];

  /* Успешная загрузка файла */
  writeStream.on('finish', () => {
    res.write('Processing  ...  100% done \n');
    res.end(`Processing  ...  file (${fileName}) uploaded successfully!`);
  });

  /* Ошибка при загрузке файла */
  writeStream.on('error', (error) => {
    res.end(`Processing   ...   error: ${error.message}`);
    /* Закрываем клиентский поток после последнего ответа */
    req.destroy(new Error('Payload too large'));
    /* Удаляем кривой файл */
    fs.unlink(filePath, (err) => {
      if (err) console.error(err);
    });
  });

  /* Обработка потока вручную */
  req.on('data', (chunk) => {
    const canWrite = writeStream.write(chunk);

    if (!canWrite) {
      req.pause();
      // Возобновляем чтение данных
      writeStream.once('drain', () => req.resume());
    }

    const { bytesWritten } = writeStream;

    if (bytesWritten > MAX_UPLOAD_SIZE) {
      /* Закрываем основной поток записи с ошибкой */
      writeStream.destroy(new Error('File size exceeded 100MB'));
      return;
    }

    let progress;
    if (contentLength) {
      const total = parseInt(contentLength);
      const pWritten = ((bytesWritten / total) * 100).toFixed(2);
      progress = `Processing  ...  ${pWritten}% done \n`;
    } else {
      progress = `Processing ... ${Math.round(bytesWritten / 1024 / 1024)}MB uploaded\n`;
    }
    res.write(progress);
  });

  /* Закрываем поток записи */
  req.on('end', () => {
    writeStream.end();
  });

  /* Закрываем поток записи с ошибкой */
  req.on('error', (err) => {
    console.error('❌ Ошибка при загрузке:', err);
    writeStream.destroy(err); // Закрываем поток при ошибке
  });
};

const downloadFile = async (params: { fields?: string[] }, req: IncomingMessage, res: ServerResponse) => {
  const { fields = [] } = params;
  const filePath = genFilePath('./big.json');
  await checkFileExistOrFail(filePath, res);
  const file = fs.createReadStream(filePath);

  const transform = new Transform({
    objectMode: true,
    transform({ value }, encoding, callback) {
      const fieldsEntries = fields.map((field) => [field, value[field]]);
      const obj = fields.length ? Object.fromEntries(fieldsEntries) : value;
      const response = JSON.stringify(obj) + '\n';
      const isWrite = res.write(response);
      if (!isWrite) this.pause();
      callback();
    },
  });

  res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
  pipeline(file, StreamArray.withParser(), transform, res, (err) => {
    if (err) responseJSONError({ message: err.message }, res);
  });
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '', 'http://localhost:3000');

  if (req.method === 'POST' && req.url === '/upload') return uploadFile(req, res);

  if (req.method === 'GET' && url.pathname === '/stream') {
    const [fieldsStr = ''] = url.searchParams.getAll('fields');
    const fields = fieldsStr.split(',').filter(Boolean);
    return downloadFile({ fields }, req, res);
  }

  responseJSONError({ statusCode: 404, message: 'Endpoint not found' }, res);
});

server.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
