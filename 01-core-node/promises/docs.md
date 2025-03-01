# Промисы и async/await в JavaScript

## 1. Основы промисов

### Что такое промис?

Промис (Promise) — это объект, представляющий результат асинхронной операции, которая может завершиться:

- **успешно** (`fulfilled`) с результатом,
- **неудачно** (`rejected`) с ошибкой,
- **в ожидании** (`pending`), если результат ещё не получен.

### Методы управления промисами

#### 1. `Promise.resolve(value)`

Создаёт выполненный промис с переданным значением:

```js
const resolvedPromise = Promise.resolve('Готово!');
resolvedPromise.then(console.log); // Готово!
```

#### 2. `Promise.reject(error)`

Создаёт отклонённый промис с ошибкой:

```js
const rejectedPromise = Promise.reject(new Error('Ошибка!'));
rejectedPromise.catch(console.error); // Error: Ошибка!
```

#### 3. `Promise.all(promises)`

Ожидает выполнения всех промисов. Если один завершится с ошибкой, `Promise.all` завершится с ошибкой.

```js
Promise.all([
  fetch('https://jsonplaceholder.typicode.com/todos/1'),
  fetch('https://jsonplaceholder.typicode.com/todos/2'),
])
  .then((responses) => console.log('Все промисы завершены', responses))
  .catch(console.error);
```

#### 4. `Promise.race(promises)`

Завершается первым выполнившимся промисом (успешным или с ошибкой):

```js
Promise.race([
  new Promise((resolve) => setTimeout(() => resolve('Первый'), 1000)),
  new Promise((resolve) => setTimeout(() => resolve('Второй'), 2000)),
]).then((result) => console.log('Первым завершился:', result));
```

#### 5. `Promise.any(promises)`

Ждёт первый **успешный** промис (игнорируя ошибки):

```js
Promise.any([
  Promise.reject(new Error('Ошибка 1')),
  new Promise((resolve) => setTimeout(() => resolve('Успешный'), 2000)),
  Promise.reject(new Error('Ошибка 2')),
])
  .then(console.log) // 'Успешный'
  .catch(console.error);
```

### Цепочки `.then`, `.catch`, `.finally`

```js
new Promise((resolve) => setTimeout(() => resolve('Шаг 1'), 1000))
  .then((value) => {
    console.log(value);
    return new Promise((resolve) => setTimeout(() => resolve('Шаг 2'), 2000));
  })
  .then(console.log)
  .catch(console.error)
  .finally(() => console.log('Готово'));
```

---

## 2. Async/Await

### Как использовать `async/await`?

`async/await` позволяет писать асинхронный код в синхронном стиле.

```js
async function fetchData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}
fetchData();
```

### Глобальная обработка ошибок

Если промис завершился с ошибкой, но `.catch()` не был вызван, ошибка попадёт в `unhandledRejection`:

```js
process.on('unhandledRejection', (error) => {
  console.error('Необработанная ошибка:', error);
});
```

---

## 3. Проблемы и ограничения

### Почему промисы нельзя "отменять"?

Промис нельзя отменить, но можно использовать `AbortController`:

```js
const controller = new AbortController();
const signal = controller.signal;

fetch('https://jsonplaceholder.typicode.com/todos/1', { signal })
  .then((response) => response.json())
  .then(console.log)
  .catch((err) => console.error('Запрос отменен:', err));

setTimeout(() => controller.abort(), 100);
```

### Организация тайм-аутов для промисов

Чтобы ограничить выполнение промиса по времени, можно использовать `Promise.race()`:

```js
function timeoutPromise(promise, ms) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Тайм-аут')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

const fetchData = timeoutPromise(fetch('https://jsonplaceholder.typicode.com/todos/1'), 5000);
fetchData.then(console.log).catch(console.error);
```

---

## **4. Примеры кода**

Для лучшего понимания темы можно ознакомиться с примерами кода:

- [abort-timeout.ts](abort-timeout.ts) – отмена промисов с тайм-аутами.
- [basics.ts](basics.ts) – основные примеры работы с промисами.
- [chains-async-await.ts](chains-async-await.ts) – использование `async/await` для цепочек вызовов.
- [chains.ts](chains.ts) – построение цепочек `.then/.catch/.finally`.
- [unhandled-rejection.ts](unhandled-rejection.ts) – обработка `unhandledRejection` в Node.js.

---

## **Выводы**

✅ **Промисы позволяют работать с асинхронностью через `.then/.catch`.**  
✅ **`async/await` делает код чище и удобнее.**  
✅ **Промисы нельзя отменять, но можно использовать `AbortController`.**  
✅ **Важно очищать таймеры в `Promise.race()`, чтобы избежать зависания Event Loop.**
