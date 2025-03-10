import { Type, type Static } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

/* Fields */
const id = Type.String({ format: 'uuid' });
const email = Type.String({ format: 'email', minLength: 1, maxLength: 100 });
const name = Type.String({ minLength: 1, maxLength: 100 });
const sex = Type.Enum({ male: 'male', female: 'female' });

export const UserParamsSchema = Type.Object({ id });

export const UserResponseSchema = Type.Object({
  id,
  email,
  name: Type.Optional(name),
  sex: Type.Optional(sex),
});

export const GetUsersResponseSchema = Type.Object({ users: Type.Array(UserResponseSchema) });
export const GetUsersResponseSchemaV2 = Type.Object({ users: Type.Array(UserResponseSchema) });

export const CreateUserBodySchema = Type.Object(
  { email, name: Type.Optional(name), sex: Type.Optional(sex) },
  { additionalProperties: false, minProperties: 1 }
);

export const UpdateUserBodySchema = Type.Object(
  { name: Type.Optional(name), sex: Type.Optional(sex) },
  { additionalProperties: false, minProperties: 1 }
);

/* Fastify схемы V1 */
export const getUsersSchema: FastifySchema = {
  summary: 'Список пользователей',
  description: 'Позволяет получить пользователей',
  tags: ['v1', 'User'],
  response: { 200: GetUsersResponseSchema },
};

export const createUserSchema: FastifySchema = {
  summary: 'Создать пользователя',
  description: 'Позволяет создать пользователя',
  tags: ['v1', 'User'],
  body: CreateUserBodySchema,
  response: { 200: UserResponseSchema },
};

export const updateUserSchema: FastifySchema = {
  summary: 'Обновить пользователя (частично)',
  description: 'Позволяет обновлять публичные данные пользователя',
  tags: ['v1', 'User'],
  params: UserParamsSchema,
  body: UpdateUserBodySchema,
  response: { 200: UserResponseSchema },
};

export const deleteUserSchema: FastifySchema = {
  summary: 'Удалить пользователя',
  description: 'Позволяет удалить пользователя',
  tags: ['v1', 'User'],
  params: UserParamsSchema,
  response: { 200: UserResponseSchema },
};

/* Fastify схемы V2 */
export const getUsersSchemaV2: FastifySchema = {
  summary: 'Список пользователей',
  description: 'Позволяет получить пользователей',
  tags: ['v2', 'User'],
  response: { 200: GetUsersResponseSchema },
};

/* Types */
export type UserParams = Static<typeof UserParamsSchema>;
export type UserResponse = Static<typeof UserResponseSchema>;
export type GetUsersResponse = Static<typeof GetUsersResponseSchema>;
export type GetUsersV2Response = Static<typeof GetUsersResponseSchemaV2>;
export type CreateUserBody = Static<typeof CreateUserBodySchema>;
export type UpdateUserBody = Static<typeof UpdateUserBodySchema>;
