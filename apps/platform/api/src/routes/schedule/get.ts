import { getAllSchedules } from '../../schedule/repository/getAllSchedules';
import { getScheduleById } from '../../schedule/repository/getScheduleById';
import type { FastifyPluginAsync } from 'fastify';

const get: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (requets, reply) => {
    try {
      const schedule = getAllSchedules();

      return schedule;
    } catch (err) {
      console.error(err);
    }
  });

  fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const schedule = getScheduleById(id);

      return schedule;
    } catch (err) {
      console.error(err);
    }
  });
};

export default get;
