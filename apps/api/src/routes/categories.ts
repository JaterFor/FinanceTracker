import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function categoryRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);

  app.get('/', async () => {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  });
}
