import fs from 'node:fs';
import crypto from 'node:crypto';

console.log('Начало программы - 1');

/* Асинхронное чтение файла (НЕ использует Thread Pool) */
fs.readFile(__filename, 'utf-8', () => {
  console.log('Файл прочитан - 2');
});

/* Хэширование пароля (Использует Thread Pool) */
crypto.pbkdf2('password', 'salt', 1_000_000, 64, 'sha512', () => {
  console.log('Хэширование завершено - 3');
});

console.log('Конец программы - 4');

// Порядок вывода: 1, 4, 2, 3
// fs.readFile() выполняется через ОС без Thread Pool, а crypto.pbkdf2() нагружает Thread Pool.
