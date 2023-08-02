import { PrismaClient } from '@prisma/client';
import { buildSeedFilePath } from '../seeder.helper';
import csv from 'csvtojson';

export async function trackSeeder(prisma: PrismaClient) {
  const seedFile = buildSeedFilePath('csv', 'track.csv');
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(seedFile)
      .subscribe(async (data) => {
        await prisma.track.upsert({
          where: {
            id: data.id,
          },
          create: {
            id: data.id,
            name: data.name,
            with_consultation: data.with_consultation,
            created_at: data.created_at,
            is_deleted: data.is_deleted,
          },
          update: {
            id: data.id,
            name: data.name,
            with_consultation: data.with_consultation,
            created_at: data.created_at,
            is_deleted: data.is_deleted,
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
