export class InvalidNumberofPaymentsException extends Error {
  constructor() {
    super('Number of payment is not equal to the defined payment on proposal!');
  }
}
