import { getTeamById } from '../../teams/repository/getTeamById';
// import * as TeamRepo from '../teams/repository/getTeamById';
import type { FastifyPluginAsync } from 'fastify';

const get: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const team = await getTeamById(id);
      fastify.log.info('This is team info', team?.name);

      return team;
    } catch (err) {
      console.error(err);
      return 'error';
    }
  });
};

export default get;
