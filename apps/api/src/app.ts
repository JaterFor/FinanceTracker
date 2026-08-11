import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify, { type FastifyError, type FastifyReply, type FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { env } from './lib/env';
import { authRoutes } from './routes/auth';
import { categoryRoutes } from './routes/categories';
import { transactionRoutes } from './routes/transactions';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string };
    user: { sub: string };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: env.CORS_ORIGIN });
  app.register(jwt, { secret: env.JWT_SECRET });

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error instanceof ZodError) {
      reply.code(400).send({ error: 'Invalid input', details: error.issues });
      return;
    }
    app.log.error(error);
    reply.code(error.statusCode ?? 500).send({ error: error.message ?? 'Internal server error' });
  });

  app.register(authRoutes, { prefix: '/auth' });
  app.register(transactionRoutes, { prefix: '/transactions' });
  app.register(categoryRoutes, { prefix: '/categories' });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
