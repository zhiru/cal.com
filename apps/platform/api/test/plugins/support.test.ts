import Support from '../../src/plugins/support';
import Fastify from 'fastify';
import { test } from 'tap';

test('support works standalone', async (t) => {
  const fastify = Fastify();
  void fastify.register(Support);
  await fastify.ready();

  t.equal(fastify.someSupport(), 'hugs');
});
