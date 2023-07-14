import { BasePrismaErrorException } from 'src/tender-commons/exceptions/prisma-error/base.prisma.error.exception';

export class PrismaTransactionExpiredException extends BasePrismaErrorException {
  constructor(detail?: string) {
    super(
      `Transaction Expired Before The Logic is Done!${
        detail ? `, more detail: ${detail}` : ''
      }`,
    );
  }
}
