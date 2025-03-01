# 🔥 Потоки (Streams) в Node.js

💡 **Потоки (Streams) — это мощный инструмент для работы с данными без загрузки всего объёма в память. Они позволяют читать, записывать, преобразовывать и передавать данные по частям, оптимизируя работу с большими файлами и потоковыми данными.**

---

## 📌 1. Зачем нужны потоки?

**✅ Основные преимущества:**

- **Экономия памяти** – можно обрабатывать **файлы любого размера**, не загружая их полностью в RAM.
- **Повышение производительности** – можно начинать обработку данных **до их полной загрузки**.
- **Гибкость** – можно комбинировать потоки для сжатия, шифрования, обработки и передачи данных по сети.

**📍 Где используются потоки?**

✔ **Чтение/запись файлов (`fs.createReadStream`, `fs.createWriteStream`)**  
✔ **HTTP-запросы и ответы (`req`, `res`)**  
✔ **TCP-соединения (`net.createServer()`)**  
✔ **WebSockets, SSE, API-стриминг**  
✔ **Шифрование, компрессия данных (Transform Stream)**

---

## 📌 2. Типы потоков в Node.js

| Тип потока                       | Описание                           | Пример                              |
| -------------------------------- | ---------------------------------- | ----------------------------------- |
| **Readable** (читаемый)          | Поток **только для чтения данных** | `fs.createReadStream('file.txt')`   |
| **Writable** (записываемый)      | Поток **только для записи данных** | `fs.createWriteStream('file.txt')`  |
| **Duplex** (двунаправленный)     | **Чтение и запись в одном потоке** | `net.Socket`, `TCP-соединения`      |
| **Transform** (трансформирующий) | **Изменяет данные на лету**        | `zlib.createGzip()`, **шифрование** |

---

## 📌 3. Примеры работы с потоками

### 📍 Читаемый поток (`Readable Stream`)

```js
const fs = require('fs');
const readStream = fs.createReadStream('bigfile.txt', 'utf8');

readStream.on('data', (chunk) => {
  console.log('📥 Получен чанк:', chunk.length, 'байт');
});

readStream.on('end', () => {
  console.log('✅ Файл прочитан полностью');
});
```

💡 **Читает файл по кускам, не загружая его в память целиком.**

---

### 📍 Записываемый поток (`Writable Stream`)

```js
const fs = require('fs');
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Первая строка\n');
writeStream.write('Вторая строка\n');

writeStream.end(() => console.log('✅ Файл записан'));
```

💡 **Записывает данные по частям в файл, управляя потоком вручную.**

---

### 📍 Pipe: соединение потоков

```js
const fs = require('fs');

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);
```

💡 **Автоматически передаёт данные из `readStream` в `writeStream` без буферизации в памяти.**

---

## 📌 4. Управление Backpressure (давлением потока)

**Backpressure** – это ситуация, когда **поток чтения слишком быстрый, а поток записи не успевает обрабатывать данные**.

### 📍 Решение через `pause()` и `resume()`

```js
const fs = require('fs');
const readStream = fs.createReadStream('bigfile.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.on('data', (chunk) => {
  const canWrite = writeStream.write(chunk);

  if (!canWrite) {
    console.log('⏸ Буфер заполнен, пауза');
    readStream.pause();
    writeStream.once('drain', () => {
      console.log('🔄 Освобождено место, продолжаем');
      readStream.resume();
    });
  }
});
```

💡 **Теперь поток чтения приостанавливается, если запись не успевает обрабатывать данные.**

---

## 📌 5. Трансформирующий поток (`Transform Stream`)

Трансформирующие потоки изменяют данные **"на лету"**. Например, можно **шифровать** или **сжимать данные**.

### **📍 Пример: потоковое шифрование**

```js
const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

const upperCaseTransform = new UpperCaseTransform();
process.stdin.pipe(upperCaseTransform).pipe(process.stdout);
```

💡 **Берёт ввод пользователя, делает верхний регистр и выводит обратно.**

---

## 📌 6. SSE (Server-Sent Events) — альтернатива WebSockets

SSE — это **потоковый HTTP-ответ**, который **сервер не закрывает**.

### **📍 Пример: SSE-сервер**

```js
const http = require('http');

const clients = [];

const server = http.createServer((req, res) => {
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    clients.push(res);

    req.on('close', () => {
      clients.splice(clients.indexOf(res), 1);
    });
  }
});

// Отправка уведомлений всем клиентам
const sendNotification = (message) => {
  clients.forEach((client) => client.write(`data: ${message}\n\n`));
};

setInterval(() => {
  sendNotification(`🔔 Новое уведомление ${new Date().toISOString()}`);
}, 5000);

server.listen(3000, () => console.log('🚀 SSE-сервер запущен на 3000'));
```

💡 **Позволяет отправлять push-уведомления без WebSockets, используя потоковый HTTP.**

---

## 📌 7. Комбинация потоков и WebSockets

Можно **объединить потоки, SSE и WebSockets** в одном приложении, чтобы создать real-time API.

- **HTTP для CRUD (регистрация, покупки).**
- **WebSockets для real-time чатов.**
- **SSE для уведомлений.**
- **Streams для оптимизации больших файлов.**

## 📌 8. Пример сервера [server.ts](./server.ts) с загрузкой файла и потоковой выдачей данных

💡 **В этом примере мы:**

✔ Принимаем **загрузку файла** через `POST /upload` **потоками**.  
✔ Отдаём **данные из файла потоком** через `GET /stream`.

---

### 📌 Как протестировать?

**Генерация большого файла**

```sh
 node -e "console.log(JSON.stringify(Array.from({ length: 1_000_000 }, (_, i) => ({ id: i, name: 'User' + i, age: 20 + (i % 50), city: 'City' + (i % 100) })), null, 2))" > big.json
```

**Загрузить файл через `curl`**

```sh
curl -X POST -F "file=@bigfile.txt" http://localhost:3000/upload
```

💡 Файл загрузится потоком и сохранится в `/streams`.

**Скачать файл потоком**

```sh
curl -O http://localhost:3000/download/big.json
```

💡 Файл **отдаётся потоком**, не загружая серверную память.
