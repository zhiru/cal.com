import fp from 'fastify-plugin';

export default fp(async (fastify, opts) => {
  fastify.addHook('preHandler', async (request, reply) => {
    // Check for authentication here
    const isAuthenticated = true;
    if (!isAuthenticated) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
    return;
  });
});
