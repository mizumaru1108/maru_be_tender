import { PrismaClient } from '@prisma/client';
import { userSeeder } from './seeders/users/user.seeder';
import { trackSeeder } from './seeders/track/track.seeder';
import { clientFieldSeeder } from './seeders/client-field/client.field.seeder';

const prisma = new PrismaClient();

async function seed() {
  console.log('load the seeders');
  await userSeeder(prisma);
  await trackSeeder(prisma);
  await clientFieldSeeder(prisma);
}

seed()
  .catch((error) => {
    console.trace(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
