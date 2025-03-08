const fastify = require('fastify')();

(async () => {
  await fastify.register(require('@fastify/swagger'));

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      // @ts-ignore
      onRequest: function (request, reply, next) {
        next();
      },
      // @ts-ignore
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    // @ts-ignore
    transformStaticCSP: (header) => header,
    // @ts-ignore
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  fastify.put(
    '/some-route/:id',
    {
      schema: {
        description: 'post some data',
        tags: ['user', 'code'],
        summary: 'qwerty',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'user id',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
            obj: {
              type: 'object',
              properties: {
                some: { type: 'string' },
              },
            },
          },
        },
        response: {
          201: {
            description: 'Successful response',
            type: 'object',
            properties: {
              hello: { type: 'string' },
            },
          },
          default: {
            description: 'Default response',
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
          },
        },
      },
    },
    (req: any, reply: any) => {}
  );

  await fastify.ready().then(() => {
    console.log('ready');
  });

  await fastify.listen({ port: 3000 }).then(() => {
    console.log('listen');
  });

  const x = fastify.swagger();
  console.log({ x });
})();
