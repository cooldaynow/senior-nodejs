# Продвинутая инструментализация в Node.js (async_hooks, perf_hooks)

В этом разделе рассмотрим мощные инструменты мониторинга и профилирования в Node.js, которые позволяют глубже понять работу асинхронного кода, измерять производительность и анализировать узкие места в системе.

---

## 1. async_hooks – Отслеживание асинхронных ресурсов

Модуль `async_hooks` в Node.js позволяет отслеживать жизненный цикл всех асинхронных операций: Promises, `setTimeout()`, `setImmediate()`, `process.nextTick()`, Worker Threads, файловые операции и другие.

### 1.1. Основные события в `async_hooks`

`async_hooks.createHook()` принимает колбэки для отслеживания состояний асинхронных ресурсов:

- **`init(asyncId, type, triggerAsyncId, resource)`** – вызывается при создании асинхронного ресурса.
- **`before(asyncId)`** – перед выполнением callback'а асинхронного ресурса.
- **`after(asyncId)`** – после выполнения callback'а.
- **`destroy(asyncId)`** – когда ресурс удаляется из памяти.

### 1.2. Пример использования `async_hooks`

Следующий код отслеживает создание и выполнение всех асинхронных операций в приложении:

```js
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';

const log = (msg) => fs.writeSync(1, msg + '\n');

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

Promise.resolve().then(() => log('Promise resolved'));
```

### 1.3. Интересные находки

1. **Каждый `.then()` создаёт новый `Promise`, получающий новый `asyncId`!**
2. **`console.log()` под капотом вызывает `process.nextTick()`, создавая `TickObject`!**
3. **Асинхронные операции связаны через `triggerAsyncId`, что позволяет отслеживать их происхождение.**

---

## 2. perf_hooks – Измерение производительности

Модуль `perf_hooks` предоставляет API для измерения скорости выполнения кода, что полезно для оптимизации запросов, функций и обработки данных.

### 2.1. Основные API `perf_hooks`

- **`performance.now()`** – высокоточное измерение времени в миллисекундах.
- **`PerformanceObserver`** – позволяет отслеживать события производительности (например, время выполнения таймеров).
- **`performance.mark()` и `performance.measure()`** – замер времени между событиями.

### 2.2. Пример: замер времени выполнения кода

```js
import { performance } from 'node:perf_hooks';

const start = performance.now();
setTimeout(() => {
  console.log(`Execution time: ${(performance.now() - start).toFixed(2)}ms`);
}, 500);
```

### 2.3. Пример: отслеживание времени работы функции

```js
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries());
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

function heavyTask() {
  performance.mark('start');
  for (let i = 0; i < 1e7; i++) {} // Имитация нагрузки
  performance.mark('end');
  performance.measure('Heavy Task Execution', 'start', 'end');
}

heavyTask();
```

---

## 3. Дополнительные инструменты профилирования

### 3.1. Clinic.js – анализ узких мест

`clinic.js` – мощный инструмент для диагностики проблем с производительностью в Node.js.

- **`clinic doctor`** – анализ CPU, памяти, Event Loop.
- **`clinic flame`** – генерация flamegraph (графика горячих точек).
- **`clinic bubbleprof`** – анализ асинхронных зависимостей.

### 3.2. Установка и запуск `clinic.js`

```sh
npm install -g clinic
clinic doctor -- node app.js
```

### 3.3. Анализ flamegraph

```sh
clinic flame -- node app.js
```

### 3.4. Альтернативные инструменты

- **`0x`** – профайлер, создающий flamegraph без перегрузки системы.
- **Chrome DevTools** – встроенные инструменты профилирования.

---

## Заключение

1. **`async_hooks` позволяет отслеживать жизненный цикл всех асинхронных ресурсов.**
2. **`perf_hooks` даёт мощные инструменты для измерения производительности.**
3. **Инструменты `clinic.js`, `0x` и Chrome DevTools помогают профилировать узкие места.**
