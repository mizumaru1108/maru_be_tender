import { PrismaClient } from '@prisma/client';
import { buildSeedFilePath } from '../seeder.helper';
import csv from 'csvtojson';

export async function userRoleSeeder(prisma: PrismaClient) {
  const seedFile = buildSeedFilePath('csv', 'user.roles.csv');
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(seedFile)
      .subscribe(async (data) => {
        await prisma.user_role.upsert({
          where: {
            id: data.id,
          },
          create: {
            id: data.id,
            user_id: data.user_id,
            user_type_id: data.user_type_id,
          },
          update: {
            user_id: data.user_id,
            user_type_id: data.user_type_id,
          },
        });
      })
      .on('done', (error) => {
        if (error) {
          return reject(error);
        }
        resolve('done');
      });
  });
}
