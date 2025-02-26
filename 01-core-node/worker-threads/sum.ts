import { parentPort } from 'node:worker_threads';
import { summaryCalc } from './helpers';

/* Поток расчета финальной суммы факториала */
parentPort!.on('message', (resultArr: number[]) => {
  const result = summaryCalc(resultArr);
  parentPort!.postMessage(result);
});
