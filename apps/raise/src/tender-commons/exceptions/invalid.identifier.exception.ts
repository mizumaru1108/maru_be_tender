export class InvalidIdentifierException extends Error {
  constructor(detail?: string) {
    super(`Invalid Identifier!${detail ? `, detail: ${detail}` : ''}`);
  }
}
