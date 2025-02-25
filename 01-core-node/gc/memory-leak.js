const memoryLeak = [];

setInterval(() => {
  const hugeArray = Array.from({ length: 1_000_000 }).fill({ data: 'leak' });
  memoryLeak.push(hugeArray); // ❌ Каждый раз добавляем новый массив
  console.log(`🔴 Утечка памяти! Текущий размер: ${memoryLeak.length}`);
}, 1000);

setInterval(() => {
  const mem = process.memoryUsage();
  console.log(`Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`External (Buffers): ${(mem.external / 1024 / 1024).toFixed(2)} MB`);
  console.log(`RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log('--------------------');
}, 5000);
