import { BasePrismaErrorException } from 'src/tender-commons/exceptions/prisma-error/base.prisma.error.exception';

export class PrismaInvalidForeignKeyException extends BasePrismaErrorException {
  constructor(code: string, clientVersion: string, meta?: Record<string, any>) {
    super();
    this.message = 'Unprocessable Entity, DB Error, Invalid Foreign Key!';
    this.name = 'Prisma Invalid Foreign Key';
    this.stack = JSON.stringify({
      code: code,
      clientVersion: clientVersion,
      meta: meta,
    });
  }
}
