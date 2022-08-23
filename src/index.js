import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

const forbiddenWord = 'fuck';

fastify.post('/uppercase', (request, reply) => {
  if (request.body.toLowerCase().includes(forbiddenWord.toLowerCase())) {
    return reply.status(403).send('unresolved');
  }
  return reply.status(200).send(request.body.toUpperCase());
});

fastify.post('/lowercase', (request, reply) => {
  if (request.body.toLowerCase().includes(forbiddenWord.toLowerCase())) {
    return reply.status(403).send('unresolved');
  }
  return reply.status(200).send(request.body.toLowerCase());
});

fastify.get('/user/:id', (request, reply) => {
  const { id } = request.params;
  if (users[id]) {
    return reply.send(users[id]);
  }
  reply.status(400).send('User does not exist');
});

fastify.get('/users', (request, reply) => {
  const { filter, value } = request.query;

  if (request.query === undefined) {
    return reply.send(Object.values(users));
  }

  const result = Object.values(users).filter((user) => user[filter] === value);

  reply.send(result);
});

export default fastify;
