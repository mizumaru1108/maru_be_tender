import { PrismaClient } from '@prisma/client';
import { buildSeedFilePath } from '../seeder.helper';
import csv from 'csvtojson';

export async function clientFieldSeeder(prisma: PrismaClient) {
  const seedFile = buildSeedFilePath('csv', 'client.field.csv');
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(seedFile)
      .subscribe(async (data) => {
        try {
          await prisma.clientFields.upsert({
            where: {
              client_field_id: data.client_field_id,
            },
            create: {
              client_field_id: data.client_field_id,
              name: data.name,
            },
            update: {
              name: data.name,
            },
          });
        } catch (error) {
          console.error('Error processing user:', data, error);
        }
      })
      .on('done', (error) => {
        if (error) {
          return reject(error);
        }
        resolve('done');
      });
  });
}
