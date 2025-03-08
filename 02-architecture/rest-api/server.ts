import Fastify from 'fastify';
import { User } from './domain/aggregates/User';
import { UserService } from './domain/services/UserService';
import { InMemoryUserRepo } from './infrastructure/repositories/InMemoryUserRepo';
import { type UpdateUserBody, UpdateUserParams, UpdateUserResponse, updateUserSchema } from './shared/schemas';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const startServer = async () => {
  try {
    const fastify = Fastify({
      logger: { transport: { target: 'pino-pretty', options: { colorize: true } } },
      requestIdHeader: 'x-request-id',
    });

    await fastify.register(swagger, {
      logLevel: 'error',
      openapi: {
        info: {
          title: 'API',
          description: 'Документация API',
          version: 'v1',
        },
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
        },
      },
    });

    await fastify.register(swaggerUi, {
      logLevel: 'error',
      routePrefix: '/docs', // 📌 Swagger UI доступен по `/docs`
      staticCSP: true,
      transformSpecification: (swaggerObject) => swaggerObject,
    });

    const userRepo = new InMemoryUserRepo();

    const userService = new UserService(userRepo);

    /* Получить список пользователей */
    fastify.get('/users', async () => {
      const users = await userService.getUsers();
      return { users: users.map((user) => user.toJSON()) };
    });

    /* Создать пользователя */
    fastify.post<{ Body: { email: User['email']; name?: User['name']; sex?: User['sex'] } }>(
      '/users',
      async (request, reply) => {
        const { body } = request;
        const user = await userService.createOne(body);
        return user.toJSON();
      }
    );

    /* Удалить пользователя с кодом 204 */
    fastify.delete<{ Params: { id: User['id'] } }>('/users/:id', async (request, reply) => {
      const { params } = request;
      const { id } = params;
      const deletedUser = await userService.deleteOne(id);
      return deletedUser.toJSON();
    });

    /* Изменить пользователя частично ( публичные поля ) */
    fastify.patch<{ Params: UpdateUserParams; Body: UpdateUserBody; Reply: UpdateUserResponse }>(
      '/users/:id',
      { schema: updateUserSchema },
      async (request, reply) => {
        const { body, params } = request;
        const { id } = params;
        const { name, sex } = body;
        const updUser = await userService.updateOnePublicData({ id, name, sex });
        return updUser.toJSON();
      }
    );

    await fastify.listen({ port: 3000, host: '127.0.0.1' });
    await fastify.ready();
    const openAPI = fastify.swagger();
    const addressInfo = fastify.server.address();

    if (!addressInfo) {
      fastify.log.error('Сервер не запущен !');
      process.exit(1);
    }
    const url =
      typeof addressInfo === 'string'
        ? `Unix Socket: ${addressInfo}` // ✅ Если сервер запущен через Unix-сокет
        : `http://${addressInfo.family === 'IPv6' ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}`;

    fastify.log.info(`${openAPI.info.title} доступен по ${url}/docs`);
  } catch (error: unknown) {
    console.error('Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

void startServer();
