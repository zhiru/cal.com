import { getAllBooking } from '../../booking/repository/getAllBooking';
import { getBookingById } from '../../booking/repository/getBookingById';
import type { FastifyPluginAsync } from 'fastify';

const get: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    const booking = getAllBooking();

    return booking;
  });

  fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
    const { id } = request.params;
    const booking = getBookingById(id);

    return booking;
  });
};

export default get;
