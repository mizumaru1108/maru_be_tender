export class PayloadRequiredException extends Error {
  constructor(payloadKey: string) {
    super(`${payloadKey} is required!`);
  }
}
