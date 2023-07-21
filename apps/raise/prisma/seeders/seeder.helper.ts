import * as path from 'path';

export function buildSeedFilePath(...pathSegments: string[]): string {
  console.log(
    `Seeding format ${pathSegments}, From ${path.join(
      process.cwd(),
      'prisma',
      'seeders',
      ...pathSegments,
    )}`,
  );

  return path.join(process.cwd(), 'prisma', 'seeders', ...pathSegments);
}
