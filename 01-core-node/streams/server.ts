import http, { IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import { pipeline, Transform } from 'node:stream';
import fs from 'node:fs';
import fspromises from 'node:fs/promises';
import path from 'node:path';
import StreamArray from 'stream-json/streamers/StreamArray';

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

const uploadFile: RequestListener = (req, res) => {};

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
