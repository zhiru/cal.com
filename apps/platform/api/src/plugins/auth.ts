import { getApiKeyByHash } from '../api-keys/repository/getApiKeyByHash';
import { getApiKeyService } from '../api-keys/services/getApiKey';
import { getUserById } from '../users/repository/getUserById';
import { dateNotInPast } from '../utils/date';
import fp from 'fastify-plugin';

export default fp(async (fastify, opts) => {
  fastify.addHook<{ Querystring: { apiKey?: string } }>('preHandler', async (request, reply) => {
    // Check for authentication here
    const { apiKey } = request.query;

    if (!apiKey) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const key = await getApiKeyService({ getApiKeyByHash }, apiKey);

    if (!key) {
      return reply.code(401).send({ error: 'Your apiKey is not valid' });
    }

    if (key.expiresAt && dateNotInPast(key.expiresAt)) {
      return reply.code(401).send({ error: 'This apiKey is expired' });
    }

    if (!key.userId) return reply.code(404).send({ error: 'No user found for this apiKey' });

    const user = await getUserById(key.userId);
    if (user) {
      request.user = { ...user, id: key.userId, isAdmin: user.role === 'ADMIN' };
    }
    return;
  });
});

declare module 'fastify' {
  export interface FastifyRequest {
    user: Awaited<ReturnType<typeof getUserById>> & { isAdmin: boolean; id: number };
  }
}
