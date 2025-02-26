import { Worker, isMainThread, parentPort } from 'node:worker_threads';

if (isMainThread) {
  // Главный поток
  console.log('Запуск Worker');
  const worker = new Worker(__filename, { execArgv: ['-r', 'ts-node/register'] });
  worker.on('message', (result) => console.log('Результат:', result));
} else {
  // Код, который выполняется в Worker Thread
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  }
  if (parentPort) parentPort.postMessage(sum);
}
