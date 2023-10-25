import type { FastifyPluginAsync } from 'fastify';

// const optsss = {
//   schema: {
//     body: {
//       type: 'object',
//       properties: {
//         someKey: { type: 'string' },
//       },
//     },
//   },
// };

// const bodyJsonSchema = {
//   type: 'object',
//   required: ['requiredKey'],
//   properties: {
//     someKey: { type: 'string' },
//     someOtherKey: { type: 'number' },
//     requiredKey: {
//       type: 'array',
//       maxItems: 3,
//       items: { type: 'integer' },
//     },
//     nullableKey: { type: ['number', 'null'] }, // or { type: 'number', nullable: true }
//     multipleTypesKey: { type: ['boolean', 'number'] },
//     multipleRestrictedTypesKey: {
//       oneOf: [
//         { type: 'string', maxLength: 5 },
//         { type: 'number', minimum: 10 },
//       ],
//     },
//     enumKey: {
//       type: 'string',
//       enum: ['John', 'Foo'],
//     },
//     notTypeKey: {
//       not: { type: 'array' },
//     },
//   },
// };

// const queryStringJsonSchema = {
//   type: 'object',
//   properties: {
//     name: { type: 'string' },
//     excitement: { type: 'integer' },
//   },
// };

// const paramsJsonSchema = {
//   type: 'object',
//   properties: {
//     par1: { type: 'string' },
//     par2: { type: 'number' },
//   },
// };

// const headersJsonSchema = {
//   type: 'object',
//   properties: {
//     'x-foo': { type: 'string' },
//   },
//   required: ['x-foo'],
// };

// const schema = {
//   body: bodyJsonSchema,
//   querystring: queryStringJsonSchema,
//   params: paramsJsonSchema,
//   headers: headersJsonSchema,
// };

const schema = {
  body: {
    properties: {
      username: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['age'],
  },
};

const post: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post('/', { schema }, async (request, reply) => {
    try {
      fastify.log.info('Hiiiiiii');

      return `Hiii`;
    } catch (err) {
      console.error(err);
    }
  });
};

export default post;
