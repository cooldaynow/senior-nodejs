import { Worker } from 'node:worker_threads';
import path from 'node:path';
import { sliceToChunks } from './helpers';

const FACTORIAL_NUM = 10;
const execArgv = ['-r', 'ts-node/register'];
const chunks = sliceToChunks(Array.from({ length: FACTORIAL_NUM }).map((_, i) => i + 1));

/* Запуск многопоточного подсчета факториала */
console.log(`Запуск Worker's`);
const workers = chunks.map(
  (chunk) =>
    new Promise<number>(async (resolve) => {
      const factorialWorker = new Worker(path.join(__dirname, './factorial.ts'), { execArgv });
      factorialWorker.postMessage(chunk);
      factorialWorker.on('message', async (result: number) => {
        resolve(result);
        await factorialWorker.terminate();
      });
    })
);

/* Запуск воркера для подсчета общей суммы факториала из частей */
Promise.all(workers).then((results) => {
  const sumWorker = new Worker(path.join(__dirname, './sum.ts'), { execArgv });
  sumWorker.postMessage(results);
  sumWorker.on('message', async (result: number) => {
    console.log(`Сумма факториала (${FACTORIAL_NUM}!) = ${result}`);
    await sumWorker.terminate();
  });
});
