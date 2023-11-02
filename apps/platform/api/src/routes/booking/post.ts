import type { FastifyPluginAsync } from 'fastify';

// const schema = {
//   body: {
//     properties: {
//       username: { type: 'string' },
//     },
//     required: ['username'],
//   },
// };

const post: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post<{ Params: { id: number } }>('/post/:id', async (request, reply) => {
    // const { id } = request.params;
    // const book = createBooking({ id });

    // console.log(book);

    return 'Booking created successfully';
  });
};

export default post;
