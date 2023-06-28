export class PrismaTransactionExpiredException extends Error {
  constructor(detail?: string) {
    super(
      `Transaction Expired Before The Logic is Done!${
        detail ? `, more detail: ${detail}` : ''
      }`,
    );
  }
}
