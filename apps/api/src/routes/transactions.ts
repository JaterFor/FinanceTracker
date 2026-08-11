import { createTransactionInputSchema } from '@finance-tracker/shared';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);

  app.get('/', async () => {
    const transactions = await prisma.transaction.findMany({
      orderBy: { occurredAt: 'desc' },
    });
    return transactions.map(serializeTransaction);
  });

  app.post('/', async (request, reply) => {
    const body = createTransactionInputSchema.parse(request.body);
    const transaction = await prisma.transaction.create({
      data: {
        amount: body.amount,
        type: body.type,
        categoryId: body.categoryId,
        accountId: body.accountId,
        note: body.note ?? null,
        occurredAt: new Date(body.occurredAt),
      },
    });
    reply.code(201);
    return serializeTransaction(transaction);
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.transaction.delete({ where: { id } });
    reply.code(204);
  });
}

function serializeTransaction(transaction: {
  id: string;
  amount: number;
  type: string;
  categoryId: string;
  accountId: string | null;
  note: string | null;
  occurredAt: Date;
  createdAt: Date;
}) {
  return {
    id: transaction.id,
    amount: transaction.amount,
    type: transaction.type,
    categoryId: transaction.categoryId,
    accountId: transaction.accountId,
    note: transaction.note,
    occurredAt: transaction.occurredAt.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
  };
}
