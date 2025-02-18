### Event Loop, асинхронность и внутренности Node.js

- [ ]  **V8 и интерпретация кода**
    - [x] AST (Abstract Syntax Tree),
    - [ ] JIT-компиляторы (Ignition, TurboFan)
    - [ ] Оптимизации.
    - [ ] Как JS-код превращается в машинный, что даёт возможность повышать производительность.

- [ ] **Garbage Collector в V8**
    - [ ] Типы GC: Mark-and-Sweep, Incremental, Generational, Concurrent.
    - [ ] “Стоп-мир” (Stop-the-world) фазы, утечки памяти в Node.js и способы их выявить (heapdump, DevTools).

- [ ] **Libuv и управление потоками**
    - [ ] Асинхронные I/O операции, Thread Pool для I/O-bound задач.
    - [ ] Ограничения при CPU-bound нагрузках.

- [x] **Фазы Event Loop**
    - [x] Timers, I/O Callbacks, Idle/Prepare, Poll, Check, Close.
    - [x] Разница между `setTimeout`, `setImmediate`, `process.nextTick`.

- [ ] **Worker Threads**
    - [ ] Полноценная многопоточность в Node.js, отличие от Thread Pool libuv.
    - [ ] Передача данных между Worker’ами.
