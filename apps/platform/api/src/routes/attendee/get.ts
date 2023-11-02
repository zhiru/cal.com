import { getAllAttendees } from '../../attendee/repository/getAllAttendees';
import { getAttendeById } from '../../attendee/repository/getAttendeeById';
import type { FastifyPluginAsync } from 'fastify';

const get: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async () => {
    const attendees = getAllAttendees();

    return attendees;
  });

  fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const attendee = getAttendeById(id);

      return attendee;
    } catch (err) {
      console.error(err);
    }
  });
};

export default get;
