export class EmailAlreadyVerifiedException extends Error {
  constructor(detail?: string) {
    super(`Email already verified!${detail ? `, detail: ${detail}` : ''}`);
  }
}
