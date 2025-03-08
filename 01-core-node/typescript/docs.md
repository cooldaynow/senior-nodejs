# TypeScript 🚀

TypeScript (TS) — это **статически типизированный язык, расширяющий JavaScript**. Он помогает писать **безопасный, предсказуемый и поддерживаемый код**, особенно в больших проектах.

В этой статье мы разберем **все ключевые концепции TypeScript**, начиная с основ и заканчивая **продвинутыми техниками, которые необходимы Senior-разработчику**.

---

## 1. Основы TypeScript

### **1.1. Типизация переменных**

В TS мы можем **явно задавать типы** переменным и функциям:

```typescript
let name: string = 'Alice';
let age: number = 30;
let isAdmin: boolean = true;
```

TS **выводит тип автоматически**:

```typescript
let city = 'New York'; // TypeScript сам понимает, что это string
```

### 1.2. Функции и их типизация

Функции можно **четко типизировать**, чтобы избежать ошибок:

```typescript
function sum(a: number, b: number): number {
  return a + b;
}
```

**Опциональные параметры:**

```typescript
function greet(name: string, age?: number): string {
  return age ? `${name} is ${age}` : `Hello, ${name}`;
}
```

---

## 2. Продвинутая типизация

### 2.1. `any`, `unknown`, `never`, `void`

#### `any` (отключает проверки – НЕ рекомендуется)

```typescript
let value: any = 42;
value = 'hello'; // ❌ Ошибки не будет
```

#### `unknown` (безопасный аналог `any`)

```typescript
let value: unknown = 'Hello';
if (typeof value === 'string') {
  console.log(value.toUpperCase()); // ✅ TS требует проверку перед использованием
}
```

#### `never` (тип, который никогда не имеет значения)

```typescript
function throwError(message: string): never {
  throw new Error(message);
}
```

#### `void` (функция ничего не возвращает)

```typescript
function logMessage(msg: string): void {
  console.log(msg);
}
```

---

### 2.2. Типизация объектов

```typescript
type User = {
  name: string;
  age: number;
  isAdmin?: boolean; // Опциональное поле
};

const user: User = { name: 'Alice', age: 25 };
```

**Readonly-объекты:**

```typescript
const user: Readonly<User> = { name: 'Alice', age: 25 };
// user.age = 30; // ❌ Ошибка
```

---

### 2.3. `interface` vs `type`

#### Интерфейсы (`interface`) расширяются динамически

```typescript
interface User {
  name: string;
}

interface Admin extends User {
  role: 'admin';
}
```

#### Типы (`type`) создают копию и НЕ обновляются автоматически

```typescript
type User = {
  name: string;
};

type Admin = User & { role: 'admin' };
```

🔹 **Если `User` изменится, `Admin` НЕ обновится автоматически.**

**Когда использовать что?**  
✅ **`interface`** – если структура может изменяться и должна обновляться динамически.  
✅ **`type`** – если нужны `union`, `mapped types` или **сложные комбинации типов**.

---

## 3. Generics – обобщенные типы

Generics позволяют **делать код гибким**, сохраняя при этом строгую типизацию.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

identity<number>(42); // ✅ OK
identity<string>('Hello'); // ✅ OK
```

**Generics в классах:**

```typescript
class Box<T> {
  constructor(private value: T) {}
  getValue(): T {
    return this.value;
  }
}

const numberBox = new Box<number>(123);
console.log(numberBox.getValue()); // 123
```

---

## 4. Работа с модулями (`import`, `export`)

TypeScript поддерживает **ES Modules** (`import/export`) и **CommonJS** (`require/module.exports`).

### ES Modules

```typescript
// User.ts
export type User = { name: string };

// app.ts
import { User } from './user';
```

### CommonJS

```typescript
// User.ts
export = { name: 'Alice' };

// app.ts
const user = require('./user');
```

🔥 **Настройки для работы с модулями в `tsconfig.json`:**

```json
{
  "module": "ESNext",
  "moduleResolution": "Node",
  "esModuleInterop": true
}
```

---

## 5. Оптимизация TypeScript

Если проект **большой**, TypeScript может **тормозить**. Как это исправить?

✅ **Используем `incremental` для ускоренной компиляции**

```json
{
  "incremental": true
}
```

✅ **Отключаем ненужные проверки**

```json
{
  "skipLibCheck": true
}
```

✅ **Разделяем `tsconfig.json` на два файла**

```json
// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "noEmit": true
}
```

```json
// tsconfig.base.json
{
  "strict": true,
  "target": "ES2022"
}
```

🔥 **Такой подход ускоряет сборку и упрощает поддержку!**

---

## 6. CLI-приложения на TypeScript

TypeScript подходит не только для серверов, но и для CLI-инструментов.

✅ **Как типизировать `process.argv`**

```typescript
import minimist from 'minimist';

const args = minimist<{ config?: string; help?: boolean }>(process.argv.slice(2));

if (args.config) {
  console.log(`Using config: ${args.config}`);
}
```

✅ **Как делать динамические импорты (`import()`)**

```typescript
async function loadModule() {
  const chalk = await import('chalk');
  console.log(chalk.default.green('Success!'));
}

loadModule();
```

🔥 **Теперь код загружает модули только при необходимости!**

---

## 7. Подводя итоги

✅ **Базовые типы и строгая типизация (`string`, `number`, `boolean`, `unknown`, `any`)**  
✅ **Разница между `interface` и `type`**  
✅ **Generics и модули**  
✅ **Как ускорить TypeScript-компиляцию**  
✅ **Как писать CLI-приложения на TS**
