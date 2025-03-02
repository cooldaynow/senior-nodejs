import async_hooks from 'node:async_hooks';
import fs from 'node:fs';

const log = (msg: string) => fs.writeSync(1, msg + '\n');

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    log(`Resource ${type} created with asyncId: ${asyncId}, triggered by: ${triggerAsyncId}`);
  },
  before(asyncId) {
    log(`Before asyncId: ${asyncId}`);
  },
  after(asyncId) {
    log(`After asyncId: ${asyncId}`);
  },
  destroy(asyncId) {
    log(`Destroy asyncId: ${asyncId}`);
  },
});

hook.enable();

// Пример как console.log вызывает process.nextTick после stream.write
console.log('Step 1');
// Затем выполняется process.nextTick
process.nextTick(() => log('Step 2'));
// А в конце уже setTimout
setTimeout(() => log('Step 3'), 0);
