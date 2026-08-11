import { loginInputSchema } from '@finance-tracker/shared';
import bcrypt from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const body = loginInputSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { username: body.username } });
    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const token = app.jwt.sign({ sub: user.id });
    return { token, user: { id: user.id, username: user.username } };
  });
}
