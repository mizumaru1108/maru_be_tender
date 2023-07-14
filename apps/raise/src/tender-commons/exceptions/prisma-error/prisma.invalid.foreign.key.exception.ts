import { BasePrismaErrorException } from 'src/tender-commons/exceptions/prisma-error/base.prisma.error.exception';

export class PrismaInvalidForeignKeyException extends BasePrismaErrorException {
  constructor(detail?: string) {
    super(
      `DB Error, invlaid foreign key!${
        detail ? `, more detail: ${detail}` : ''
      }`,
    );
  }
}
