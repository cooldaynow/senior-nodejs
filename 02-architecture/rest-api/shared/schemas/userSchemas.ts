import { Type, type Static } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

// ✅ Описываем тело запроса
export const UpdateUserBodySchema = Type.Object(
  {
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
    sex: Type.Optional(Type.Enum({ male: 'male', female: 'female' })),
  },
  { additionalProperties: false, minProperties: 1 }
);

// ✅ Описываем параметры запроса
export const UpdateUserParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

// ✅ Описываем JSON-ответ
export const UpdateUserResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  sex: Type.Optional(Type.String()),
});

// ✅ Описываем схему Fastify для OpenAPI
export const updateUserSchema: FastifySchema = {
  summary: 'Обновить пользователя (частично)',
  description: 'Позволяет обновлять публичные данные пользователя.',
  tags: ['User'], // 📌 Категория в Swagger UI
  params: UpdateUserParamsSchema,
  body: UpdateUserBodySchema,
  response: {
    200: UpdateUserResponseSchema, // 📌 Описание успешного ответа
    400: Type.Object({ error: Type.String() }), // 📌 Ошибка валидации
  },
};

// ✅ Генерируем TypeScript-типы
export type UpdateUserBody = Static<typeof UpdateUserBodySchema>;
export type UpdateUserParams = Static<typeof UpdateUserParamsSchema>;
export type UpdateUserResponse = Static<typeof UpdateUserResponseSchema>;
