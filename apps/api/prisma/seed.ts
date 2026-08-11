import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD ?? 'change-me-please';

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  const categories: Array<{
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
  }> = [
    { name: 'Salary', type: 'income', icon: '💰', color: '#f1c40f' },
    { name: 'Groceries', type: 'expense', icon: '🛒', color: '#2ecc71' },
    { name: 'Transport', type: 'expense', icon: '🚌', color: '#3498db' },
    { name: 'Other', type: 'expense', icon: '📦', color: '#95a5a6' },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findFirst({ where: { name: category.name } });
    if (!existing) {
      await prisma.category.create({ data: category });
    }
  }

  console.log(`Seeded user "${email}" and ${categories.length} categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
