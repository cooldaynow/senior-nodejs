import fs from 'node:fs';
import net from 'node:net';

// Порядок вывода в консоль: 1, 12, 11, 9, 10, 2, 3, 6, 7, 5, 8, 4
// Синхронный код 1, 12
// Микротаски 11, 9
// Файл еще не успел считаться, как и открыться/закрыться сокет пропускаем фазы
// Закрываем check фазу => setImmediate 10
// Фаза timers => 2
// Фаза Poll, тут коллбэк от fs => 3
// Внутри коллбэка приоритет у nextTick => 6, 7
// Дальше фаза check => значит закрываем setImmediate 5
// Отложили таймаут на следующий цикл
// Закрыли сокет 8
// Новый цикл, фаза timers => 4
// Иногда сокет закрывается позже выполнения setTimeout, тогда порядок в конце 4, 8

console.log('1 - console.log');

setTimeout(() => {
  console.log('2 - setTimeout');
}, 0);

fs.readFile(__filename, () => {
  console.log('3 - File Read');

  setTimeout(() => console.log('4 - setTimeout inside readFile'), 0);
  setImmediate(() => console.log('5 - setImmediate inside readFile'));

  process.nextTick(() => console.log('6 - nextTick inside readFile'));
  Promise.resolve().then(() => console.log('7 - Promise inside readFile'));
});

const server = net
  .createServer((socket) => {
    socket.on('close', () => {
      console.log('8 - socket closed');
      server.close(); // закрываем сервер, чтобы не висел
    });
  })
  .listen(8080, () => {
    const client = net.createConnection({ port: 8080 }, () => {
      client.end();
    });
  });

process.nextTick(() => console.log('9 - nextTick'));

setImmediate(() => console.log('10 - setImmediate'));

Promise.resolve().then(() => console.log('11 - Promise'));

console.log('12 - console.log');
