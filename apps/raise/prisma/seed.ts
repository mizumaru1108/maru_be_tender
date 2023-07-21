import { PrismaClient } from '@prisma/client';
import { userSeeder } from './seeders/users/user.seeder';

const prisma = new PrismaClient();

async function seed() {
  console.log('load the seeders');
  // testSeed();
  await userSeeder(prisma);
  // await userRoleSeeder();
}

seed()
  .catch((error) => {
    console.trace(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
