export class PayloadErrorException extends Error {
  constructor(detail?: string) {
    super(
      `Something wrong with the Payloads!${
        detail ? `, detail: ${detail}` : ''
      }`,
    );
  }
}
