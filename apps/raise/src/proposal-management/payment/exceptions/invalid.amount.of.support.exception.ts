export class InvalidAmountOfSupportException extends Error {
  constructor() {
    super('Amount required for support is not the same as the payload amount!');
  }
}
