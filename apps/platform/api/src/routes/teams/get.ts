import { getTeamById } from '../../teams/repository/getTeamById';
// import * as TeamRepo from '../teams/repository/getTeamById';
import type { FastifyPluginAsync } from 'fastify';

const get: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const team = await getTeamById(id);

      return team;
    } catch (err) {
      console.error(err);
      return 'error';
    }
  });
};

export default get;
