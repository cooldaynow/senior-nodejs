import { parentPort } from 'node:worker_threads';
import { factorialArrCalc } from './helpers';

parentPort!.on('message', (factorialArr: number[]) => {
  const result = factorialArrCalc(factorialArr);
  parentPort!.postMessage(result);
});
