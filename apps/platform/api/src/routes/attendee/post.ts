import type { FastifyPluginAsync } from 'fastify';

const body = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    timezone: { type: 'string' },
    id: { type: 'number' },
    email: { type: 'string' },
  },
  required: ['name', 'email'],
};
const schema = {
  body: body,
};

const post: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Body: { name: string; timezone: string; email: string; id: number };
  }>('/create', { schema }, async (request, reply) => {
    try {
      console.log('This is the request body', request.body);
      console.log('This is the query params', request.query);

      return `Successs`;
    } catch (err) {
      console.error(err);
    }
  });
};

export default post;
