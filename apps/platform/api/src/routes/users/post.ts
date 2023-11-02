import * as UserEntities from '../../users/entities';
import * as UserRepo from '../../users/repository';
import * as UserServices from '../../users/services';
import type { FastifyPluginAsync } from 'fastify';

const post: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.register(import('../../plugins/auth'));

  fastify.post('/users', async function (request, reply) {
    try {
      const parsedBody = UserEntities.createUserBodySchema.parse(request.body);
      const user = await UserServices.createUserService(
        { persistUser: UserRepo.createUser },
        parsedBody.username,
        parsedBody.email,
        parsedBody.password,
      );
      return user;
    } catch (err) {
      console.error(err);
      return 'error';
    }
  });
};

export default post;
