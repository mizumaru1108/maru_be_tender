import { PrismaClient } from '@prisma/client';
import { buildSeedFilePath } from '../seeder.helper';
import csv from 'csvtojson';

export async function userSeeder(prisma: PrismaClient) {
  const seedFile = buildSeedFilePath('csv', 'user.csv');
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(seedFile)
      .subscribe(async (data) => {
        try {
          await prisma.user.upsert({
            where: {
              email: data.email,
            },
            create: {
              id: data.id,
              employee_name: data.employee_name,
              mobile_number: data.mobile_number,
              email: data.email,
              status_id: data.status_id,
              track_id: data.track_id || null,
            },
            update: {
              email: data.email,
              employee_name: data.employee_name,
              mobile_number: data.mobile_number,
              status_id: data.status_id,
              track_id: data.track_id || null,
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
