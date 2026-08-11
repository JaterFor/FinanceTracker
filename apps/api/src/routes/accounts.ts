import { createAccountInputSchema } from '@finance-tracker/shared';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function accountRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);

  app.get('/', async () => {
    return prisma.account.findMany({ orderBy: { name: 'asc' } });
  });

  app.post('/', async (request, reply) => {
    const body = createAccountInputSchema.parse(request.body);
    const account = await prisma.account.create({ data: body });
    reply.code(201);
    return account;
  });
}
