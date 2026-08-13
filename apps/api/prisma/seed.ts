import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? 'admin';

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  const categories: Array<{
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
  }> = [
    { name: 'Зарплата', type: 'income', icon: 'banknote', color: '#f1c40f' },
    { name: 'Подработка', type: 'income', icon: 'briefcase', color: '#16a085' },
    { name: 'Продукты', type: 'expense', icon: 'shopping-cart', color: '#2ecc71' },
    { name: 'Транспорт', type: 'expense', icon: 'bus', color: '#3498db' },
    { name: 'Кафе и рестораны', type: 'expense', icon: 'utensils', color: '#e67e22' },
    { name: 'Дом и коммуналка', type: 'expense', icon: 'home', color: '#9b59b6' },
    { name: 'Здоровье', type: 'expense', icon: 'heart', color: '#e74c3c' },
    { name: 'Образование', type: 'expense', icon: 'graduation-cap', color: '#1abc9c' },
    { name: 'Путешествия', type: 'expense', icon: 'plane', color: '#0984e3' },
    { name: 'Подарки', type: 'expense', icon: 'gift', color: '#e84393' },
    { name: 'Связь и интернет', type: 'expense', icon: 'smartphone', color: '#636e72' },
    { name: 'Развлечения', type: 'expense', icon: 'gamepad', color: '#6c5ce7' },
    { name: 'Спорт', type: 'expense', icon: 'dumbbell', color: '#00b894' },
    { name: 'Питомцы', type: 'expense', icon: 'paw-print', color: '#d35400' },
    { name: 'Другое', type: 'expense', icon: 'package', color: '#95a5a6' },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findFirst({ where: { name: category.name } });
    if (!existing) {
      await prisma.category.create({ data: category });
    }
  }

  console.log(`Seeded user "${username}" and ${categories.length} categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
