import { getAllEventTypes } from '../../eventType/repository/getAllEventTypes';
import { getEventTypeById } from '../../eventType/repository/getEventTypeById';
import type { FastifyPluginAsync } from 'fastify';

const get: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    const eventType = getAllEventTypes();

    return eventType;
  });

  fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const eventTypes = getEventTypeById(id);

      return eventTypes;
    } catch (err) {
      console.error(err);
    }
  });
};

export default get;
