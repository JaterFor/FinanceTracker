import { createCategoryInputSchema } from '@finance-tracker/shared';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function categoryRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);

  app.get('/', async () => {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  });

  app.post('/', async (request, reply) => {
    const body = createCategoryInputSchema.parse(request.body);
    const category = await prisma.category.create({ data: body });
    reply.code(201);
    return category;
  });
}
