# Модули в Node.js: Полное руководство

Node.js использует систему модулей для организации кода. Существуют два основных типа модулей: **CommonJS (CJS)** и **ES Modules (ESM)**. Эта статья доконально разбирает все нюансы их работы, включая кэширование, динамический импорт и миграцию с CJS на ESM.

---

## 1. CommonJS vs ES Modules

**CommonJS (CJS)** – это старая, но до сих пор широко используемая система модулей в Node.js. Она появилась раньше, чем ES Modules, и работает на базе `require()`.

**ES Modules (ESM)** – это стандарт ECMAScript, который пришёл из браузерного окружения и постепенно становится стандартом в Node.js. Он использует `import/export`.

### **Главные отличия**

| Характеристика    | CommonJS (`require()`)                           | ES Modules (`import/export`)                                      |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| **Поддержка**     | По умолчанию во всех версиях Node.js             | Полная поддержка с Node.js 12+                                    |
| **Синтаксис**     | `const module = require('module')`               | `import module from 'module'`                                     |
| **Загрузка**      | **Синхронная** (код выполняется последовательно) | **Асинхронная** (можно использовать `import()`)                   |
| **Использование** | Работает везде в Node.js                         | Требует `package.json` с `"type": "module"` или `.mjs` расширения |
| **Кэширование**   | Автоматическое (модуль загружается один раз)     | Тоже есть, но отличается логика                                   |

---

## 2. Продвинутое кэширование модулей

### `module.children`, `module.parent` и их влияние на повторные импорты

- `module.children` содержит список модулей, загруженных внутри текущего модуля.
- `module.parent` указывает, какой модуль загрузил текущий модуль.

Пример:

```js
// parent.js
const child = require('./child');
console.log(module.children);
```

```js
// child.js
console.log('Child module loaded');
```

Если `parent.js` импортирует `child.js`, то `child.js` будет записан в `module.children`.

### Как изменять поведение кэширования через `require.cache`

Можно удалить модуль из кэша и повторно его загрузить:

```js
delete require.cache[require.resolve('./child')];
const freshChild = require('./child');
```

Это приведёт к повторной загрузке модуля при следующем `require('./child')`.

### Почему модули могут не выгружаться из памяти

Даже если удалить модуль из `require.cache`, он может оставаться в памяти, если:

1. **На него ссылаются другие модули**. Если другой модуль всё ещё использует его, он остаётся в памяти.
2. **Есть глобальные объекты или таймеры**. Если модуль содержит `setInterval`, `setTimeout` или глобальные переменные, они продолжают удерживать его в памяти.

Чтобы гарантированно выгрузить модуль, нужно:

- Удалить его из `require.cache`.
- Убедиться, что нет ссылок на него в других модулях.
- Очистить глобальные таймеры и события.

Пример принудительной выгрузки:

```js
const modulePath = require.resolve('./child');
delete require.cache[modulePath];
Object.keys(require.cache).forEach((key) => {
  if (require.cache[key].children.includes(require.cache[modulePath])) {
    delete require.cache[key];
  }
});
```

---

## 3. Динамический импорт (`import()`)

Динамический импорт – это фича ES Modules, которая позволяет загружать модули **во время выполнения**.

```js
async function loadModule() {
  const module = await import('./module1.js');
  console.log(module.default);
}

loadModule();
```

---

## 4. Миграция с CommonJS на ES Modules

Если у тебя старый код на CommonJS, то переходить на ESM можно постепенно.

1. Добавь в `package.json` строку:
   ```json
   {
     "type": "module"
   }
   ```
2. Измени `require()` на `import`.
3. Убери `module.exports` и используй `export`.

Пример миграции:

```js
// CommonJS (старый код)
const fs = require('fs');
module.exports = { readFile: fs.readFile };
```

```js
// ES Modules (новый код)
import fs from 'fs';
export const readFile = fs.readFile;
```

---

## 5. Итог

1. **CommonJS (`require()`)** – это старый, но проверенный стандарт.
2. **ES Modules (`import/export`)** – современный и официальный стандарт, работающий **асинхронно**.
3. **Tree Shaking** работает только с ES Modules.
4. **Динамический импорт (`import()`)** позволяет загружать модули по мере необходимости.
5. **Продвинутое кэширование** требует понимания `module.children`, `module.parent` и правильного удаления модулей.
