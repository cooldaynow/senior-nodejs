# **ПЛАН ИЗУЧЕНИЯ NODE.JS ДО УРОВНЯ SENIOR И ВЫШЕ**

## **1. Node.js и асинхронность**

### **1.1. Event Loop, асинхронность и внутренности Node.js**

- [x] **V8 и интерпретация кода**

  - [x] Понимание: AST (Abstract Syntax Tree), JIT-компиляторы (Ignition, TurboFan), оптимизации.
  - [x] Как JS-код превращается в машинный, что даёт возможность повышать производительность.

- [x] **Garbage Collector в V8**

  - [x] Типы GC: Mark-and-Sweep, Incremental, Generational, Concurrent.
  - [x] “Стоп-мир” (Stop-the-world) фазы, утечки памяти в Node.js и способы их выявить (heapdump, DevTools).

- [x] **Libuv и управление потоками**

  - [x] Асинхронные I/O операции, Thread Pool для I/O-bound задач.
  - [x] Ограничения при CPU-bound нагрузках.

- [x] **Фазы Event Loop**

  - [x] Timers, I/O Callbacks, Idle/Prepare, Poll, Check, Close.
  - [x] Разница между `setTimeout`, `setImmediate`, `process.nextTick`.

- [x] **Worker Threads**
  - [x] Полноценная многопоточность в Node.js, отличие от Thread Pool libuv.
  - [x] Передача данных между Worker’ами.

> **Задача**:
>
> - [x] Сделать скрипт, который вычисляет факториал больших чисел в Worker Thread (не блокирует основной поток).

---

### **1.2. Модули в Node.js**

- [x] **CommonJS vs ES Modules**

  - [x] `require` vs `import`, плюсы/минусы, когда использовать ESM.

- [x] **Кэширование модулей**

  - [x] Как работает `require()`, единый инстанс модуля, ручной сброс кэша.

- [x] **Динамический импорт**
  - [x] `import()` для lazy loading и плагинов.

---

### **1.3. Потоки (Streams) и работа с файлами**

- [x] **Концепция потоков**

  - [x] Зачем нужны Streams, экономия памяти при обработке больших файлов.

- [x] **Типы потоков**

  - [x] Readable (чтение), Writable (запись), Duplex (двунаправленный), Transform (преобразование).
  - [x] Применение: чтение/запись файлов, HTTP-запросы, TCP-соединения, шифрование и сжатие “на лету”.

- [x] **Pipe и Backpressure**

  - [x] `.pipe()` для подключения потоков друг к другу.
  - [x] Решение проблемы Backpressure (управление скоростью чтения/записи).

> **Задача**:
>
> - [x] Сделать загрузку/выгрузку больших файлов через HTTP без превышения по памяти, используя Pipe.

---

### **1.4. Промисы и async/await**

- [x] **Основы промисов**

  - [x] `Promise.resolve`, `Promise.reject`, `Promise.all`, `Promise.race`, `Promise.any`.
  - [x] Цепочки `.then`, `.catch`, `.finally`.

- [x] **Async/Await**

  - [x] Упрощение работы с асинхронностью, `try/catch` и `.catch()`, глобальные `unhandledRejection`.

- [x] **Проблемы и ограничения**

  - [x] Почему промисы нельзя «отменять», когда лучше Worker Threads.
  - [x] Организация тайм-аутов для промисов.

> **Задача**:
>
> - [x] Реализовать функцию, которая прерывает промис по тайм-ауту (например, «если задача не закончится за 5 секунд — отменяем»).

---

### **1.5. TypeScript**

- [x] **Зачем TypeScript**

  - [x] Типобезопасность, автодополнение, упрощение рефакторинга.

- [x] **Основы**

  - [x] Интерфейсы, типы (type), generics, enum.

- [x] **Продвинутая типизация**

  - [x] Conditional Types, Utility Types (Partial, Pick, Omit, Required), Mapped Types.

- [x] **Интеграция**

  - [x] Настройка `tsconfig.json`, декларирование типов (DefinitelyTyped), синхронизация с Node.js API.

---

### 1.6. Продвинутая инструментализация (async_hooks, perf_hooks)

- [x] **async_hooks**

  - [x] Отслеживание цикла жизни асинхронных ресурсов, создание контекста запросов.

- [x] **perf_hooks**

  - [x] Замеры производительности, время ответа, метрики.

- [x] **Дополнительные инструменты профилирования**

  - [x] `clinic.js` (Doctor, Flame, Bubbleprof), `0x` для flamegraphs, Chrome DevTools.

> **Задача**:
>
> - [x] Сделать middleware с использованием async_hooks, которое добавляет уникальный request-id и прокидывает его в логи.

---

## **2. Архитектура крупных систем**

### **2.1. REST API и его оптимизация**

- [ ] **Проектирование REST API**

  - [ ] Принципы REST, уровни зрелости (Richardson Maturity Model).
  - [ ] Версионирование API (v1, v2).

- [ ] **Оптимизация запросов**

  - [ ] HTTP/2 (мультиплексирование, сжатие заголовков).
  - [ ] Кэширование (ETag, Last-Modified, Cache-Control).

- [ ] **Rate Limiting и защита от DDoS**
  - [ ] `express-rate-limit`, Redis, NGINX.

> **Задача**:
>
> - [ ] Создать REST API (например, для управления пользователями) с версионированием.
> - [ ] Добавить поддержку ETag и протестировать поведение клиентов с 304 Not Modified.
> - [ ] Настроить лимиты на количество запросов в минуту.

---

### **2.2. GraphQL**

- [ ] **Основы GraphQL**

  - [ ] Query, Mutation, Subscription.
  - [ ] Сравнение с REST (гибкость, сокращение «прогонов»).

- [ ] **Оптимизация**
  - [ ] Избежание N+1 с помощью DataLoader.
  - [ ] Persisted Queries.

> **Задача**:
>
> - [ ] Реализовать GraphQL-сервер (например, на Apollo) для CRUD задач (TODO-list).
> - [ ] Подключить DataLoader, чтобы сократить лишние запросы к базе.

---

### **2.3. WebSockets и SSE**

- [ ] **WebSockets**

  - [ ] Полнодуплексная связь, `ws`, `socket.io`.
  - [ ] Реализация чата или коллаборативного приложения.

- [ ] **Server-Sent Events (SSE)**
  - [ ] Односторонний стрим данных от сервера к клиенту.

> **Задача**:
>
> - [ ] Написать мини-чат-приложение на WebSockets (публичные комнаты и приватные сообщения).
> - [ ] Реализовать SSE для уведомлений (например, рассылка статусов заказов).

---

### **2.4. Микросервисная архитектура**

- [ ] **Монолит vs Микросервисы**

  - [ ] Когда микросервисы оправданы, основные паттерны (API Gateway, Service Discovery).

- [ ] **Взаимодействие микросервисов**

  - [ ] Синхронное (REST, gRPC), асинхронное (Pub/Sub через Kafka, NATS, RabbitMQ).

- [ ] **Построение**
  - [ ] API Gateway для входящих запросов, а сзади несколько сервисов.

> **Задача**:
>
> - [ ] Разработать 2–3 микросервиса (пользователи, заказы, платежи) + API Gateway.
> - [ ] Настроить взаимодействие через NATS (Pub/Sub) или Kafka.

---

### **2.5. Тестирование и CI/CD**

- [ ] **Тестирование**

  - [ ] Модульные тесты (Jest/Mocha), интеграционные (Supertest), Mocking (Sinon).
  - [ ] Целевые показатели coverage (80%+).

- [ ] **CI/CD**

  - [ ] GitHub Actions, GitLab CI, Jenkins: автоматический прогон тестов, линтинга, сборки.
  - [ ] CD: деплой по пушу в main, откат при ошибках.

- [ ] **Обсервабилити**
  - [ ] Логирование (Winston, Pino), мониторинг (Prometheus, Grafana), трассировка (Jaeger, Zipkin).

> **Задача**:
>
> - [ ] Покрыть тестами ключевые сервисы (юнит + интеграция).
> - [ ] Настроить CI-пайплайн, который билдит приложение и выкатывает его на staging/production.
> - [ ] Подключить Prometheus к Node.js (экспорт метрик), отобразить в Grafana.

---

### **2.6. Docker и Kubernetes**

- [ ] **Docker**

  - [ ] Создание Dockerfile: multi-stage build, оптимизация образов.
  - [ ] `docker-compose`: локальное окружение (Node + Redis + БД).
  - [ ] Регистри (Docker Hub, GHCR).

- [ ] **Kubernetes**

  - [ ] Основные объекты: Pod, Deployment, Service, Ingress, ConfigMap, Secret.
  - [ ] Масштабирование: HPA (Horizontal Pod Autoscaler), Rolling Update.
  - [ ] Helm Charts: упаковка манифестов, templating, values.

- [ ] **DevOps-практики**
  - [ ] GitOps (ArgoCD, Flux), Terraform/Pulumi для IaC.
  - [ ] CI/CD в контексте K8s: авторазвёртывание, управление конфигурациями.

> **Задача**:
>
> - [ ] Упаковать микросервисы в Docker-образы, собрать через docker-compose.
> - [ ] Задеплоить в Kubernetes (Deployment + Service + Ingress).
> - [ ] Настроить Helm Chart и автодеплой через GitHub Actions.

---

### **2.7. DDD (Domain-Driven Design) и Advanced Patterns**

- [ ] **Основные принципы DDD**

  - [ ] Ubiquitous Language, Bounded Context, Entities, Value Objects, Repositories.
  - [ ] Контейнеризация доменной логики, стратегические/тактические паттерны.

- [ ] **CQRS + Event Sourcing** (при желании)

  - [ ] Разделение операций на чтение/запись, хранение событий вместо состояний.

- [ ] **Design Patterns**
  - [ ] (Factory, Adapter, Strategy, Observer, Decorator, Proxy) и их применение в Node.js.

> **Задача**:
>
> - [ ] Выделить Bounded Context (например, «Пользователи», «Заказы»), описать доменные сущности.
> - [ ] Попробовать применить CQRS (отдельный сервис для чтения, отдельный для записи).

---

## **3. Безопасность на уровне эксперта**

### **3.1. Аутентификация и авторизация**

- [ ] **JWT, OAuth2, OpenID Connect**

  - [ ] Хранение и ротация токенов, refresh-токены, blacklist.

- [ ] **Роли и права**
  - [ ] RBAC (Role-Based Access Control) vs ABAC (Attribute-Based).

> **Задача**:
>
> - [ ] Настроить JWT-аутентификацию для микросервисов, обеспечить автоматическое обновление access-токена.
> - [ ] Реализовать роли (admin, user) и разграничение доступа.

---

### **3.2. Защита API от атак**

- [ ] **SQL-инъекции, XSS, CSRF**

  - [ ] Использование ORM (sequelize, typeorm, knex) или параметризованных запросов.
  - [ ] Helmet, csurf.

- [ ] **Rate Limiting, Anti-DDoS**

  - [ ] Cloudflare, NGINX, iptables.

- [ ] **Zero Trust Architecture**
  - [ ] Минимально необходимый доступ между сервисами (service-to-service auth).

> **Задача**:
>
> - [ ] Настроить middleware для CSRF, проверить устойчивость к XSS (CSP-заголовки).
> - [ ] Реализовать аутентификацию между микросервисами (с помощью JWT или mTLS).

---

### **3.3. Безопасность кода и инфраструктуры**

- [ ] **npm audit, Snyk**

  - [ ] Автоматические проверки зависимостей, регулярные обновления.

- [ ] **TLS/HTTPS**

  - [ ] Шифрование каналов, настройка сертификатов.

- [ ] **Side-channel атаки**
  - [ ] Spectre/Meltdown, общие рекомендации, как Node.js может быть затронут.

> **Задача**:
>
> - [ ] Настроить автоматический аудит зависимостей при каждом пуше.
> - [ ] Перейти на HTTPS с собственным сертификатом, добавить HSTS-заголовок.

---

### **3.4. Криптография (Crypto-модуль и PKI)**

- [ ] **Crypto-модуль Node.js**

  - [ ] Шифрование (AES), хэширование (SHA, bcrypt), цифровые подписи (RSA, ECDSA).

- [ ] **SSL/TLS**

  - [ ] Самостоятельная генерация ключей и сертификатов (OpenSSL), настройка безопасности.

- [ ] **PKI**
  - [ ] Свой мини-CA, выдача и отзыв сертификатов.

> **Задача**:
>
> - [ ] Организовать mini-CA (Certificate Authority) для локальных сервисов и проверить взаимную аутентификацию (mTLS).
> - [ ] Использовать Crypto-модуль для шифрования конфиденциальных полей (например, номеров карт).

---

## **4. Финальная проверка знаний (Low-Level + Архитектура)**

### **Итоговый челлендж: разработать свой мини-фреймворк**

- [ ] **HTTP-сервер** на чистом `http`-модуле (никаких Express/Fastify).
- [ ] **Middleware-архитектура** (как Koa), чтобы можно было подключать плагины.
- [ ] **Роутинг** с параметрами (например, `/users/:id`).
- [ ] **Обработка асинхронности** (async/await + корректная обработка ошибок).
- [ ] **Использование Streams** (отдача больших файлов).
- [ ] **Система плагинов** (динамическая загрузка модулей).
- [ ] **Глобальная обработка ошибок** (и статус-коды, и логи).
- [ ] **Тесты** (Jest или Mocha) на ключевые роуты/функции.
- [ ] **Производительность** — постарайся в бенчмарках приблизиться или превзойти Express.

> **Задача**:
>
> - [ ] Собрать этот фреймворк в Docker-образ и запустить под нагрузкой (например, через `wrk` или `autocannon`).
> - [ ] Оценить метрики (RPS, Latency), профилировать (clinic.js) и оптимизировать, как только возможно.

---

# **ИТОГ**

Пройдя через **все** пункты этого плана, ты освоишь:

- [ ] **Глубокие внутренности Node.js** (V8, Event Loop, libuv, Worker Threads, Streams).
- [ ] **Асинхронность** и её инструменты (Promises, async/await, async_hooks, perf_hooks).
- [ ] **TypeScript** и **продвинутые фишки** Node.js (в т.ч. профилирование и оптимизация).
- [ ] **Архитектуру** (REST, GraphQL, WebSockets, микросервисы, DDD, CQRS) и **CI/CD**.
- [ ] **Docker и Kubernetes** для контейнеризации и оркестрации.
- [ ] **Безопасность** (XSS, CSRF, JWT, PKI, криптография), DevSecOps-подход.
- [ ] **Финальный проект** — собственный мини-фреймворк на Node.js, проверяющий все навыки.
