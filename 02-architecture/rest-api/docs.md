# 📌 Оптимизация REST API: Проектирование, Производительность, Безопасность

## 🔹 1. Проектирование REST API

### **Принципы REST и уровни зрелости (Richardson Maturity Model)**

Richardson Maturity Model определяет уровень соответствия API принципам REST:

1️⃣ **Level 0 (Транспортный уровень)** – API просто использует HTTP для передачи данных (аналог RPC, без ресурсов).

2️⃣ **Level 1 (Ресурсы)** – В API появляются ресурсы, но методы HTTP не используются по
назначению (`/getUsers`, `/deleteUser`).

3️⃣ **Level 2 (HTTP-методы и коды ответов)** – API правильно использует `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, а также
коды ответов `200`, `201`, `204`, `400`, `404`, `500`.

4️⃣ **Level 3 (HATEOAS)** – API предоставляет гипермедиа-ссылки, указывающие на связанные действия.

✅ **Продакшн-уровень – минимум Level 2.**

**Пример Level 3 (HATEOAS)**:

```json
{
  "users": [
    {
      "id": "123",
      "name": "John Doe",
      "links": {
        "self": "/api/v1/users/123",
        "update": "/api/v1/users/123",
        "delete": "/api/v1/users/123"
      }
    }
  ]
}
```

---

## 🔹 2. Версионирование API

✅ **Лучший подход – через URL:** `/api/v1/`, `/api/v2/`.

**Другие варианты:**

- Через заголовок `Accept-Version: 1.0.0`.
- Через поддомены `v1.api.example.com`.

⚡ **Важно:** Логировать, какие версии API используются клиентами.

---

## 🔹 3. Оптимизация запросов

### **1️⃣ HTTP/2 (мультиплексирование, сжатие заголовков)**

✅ **Включаем HTTP/2 в NGINX:**

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
}
```

✅ **Добавляем для сжатия заголовков:**

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

### **2️⃣ Кэширование (ETag, Last-Modified, Cache-Control)**

✅ **Добавляем **``** в Fastify:**

```ts
fastify.addHook('onSend', async (req, reply, payload) => {
  const hash = require('crypto').createHash('sha1').update(payload).digest('hex');
  reply.header('ETag', `"${hash}"`);
  return payload;
});
```

✅ **Настраиваем кэш в NGINX:**

```nginx
location /api/ {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}
```

**Проверка кэша:**

```sh
curl -I https://example.com/api/users
```

Если API отдаёт `304 Not Modified`, значит кэш работает.

---

### **3️⃣ Rate Limiting и защита от DDoS**

✅ **Ограничение запросов в NGINX:**

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;
server {
    location /api/ {
        limit_req zone=api_limit burst=10 nodelay;
    }
}
```

✅ **Ограничение запросов через Redis в Fastify:**

```ts
import fastifyRateLimit from '@fastify/rate-limit';
import Redis from 'ioredis';

const redisClient = new Redis({ host: 'localhost', port: 6379 });

await fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
  redis: redisClient,
});
```

✅ **Защита от DDoS через fail2ban:**

```sh
sudo apt install fail2ban -y
```

**Создаём правило для блокировки слишком частых запросов:**

```sh
echo -e "[Definition]\nfailregex = .*HTTP.* 429.*\nignoreregex =" | sudo tee /etc/fail2ban/filter.d/nginx-limit.conf
```

---

## 🚀 **Заключение**

✅ REST API на **Level 2** – хороший стандарт для продакшена.

✅ Включаем **HTTP/2, кэширование и сжатие заголовков** для
скорости.

✅ Используем **Rate Limiting (Redis + NGINX) и fail2ban** для защиты от атак.

✅ Логируем **использование версий API**, чтобы не держать старые версии вечно.

---

## 🔗 Пример сервера REST API: [server.ts](./server.ts)
