import { performance, PerformanceObserver } from 'perf_hooks';

/* expensiveFunction */
const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries());
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

(() => {
  performance.mark('start');
  for (let i = 0; i < 1e7; i++) {} // Нагрузка на CPU
  performance.mark('end');
  performance.measure('Expensive Function Execution', 'start', 'end');
})();

/* timeout */
(() => {
  const start = performance.now();
  setTimeout(() => {
    console.log(`Execution time: ${(performance.now() - start).toFixed(2)}ms`);
  }, 500);
})();
