export class InvalidFileExtensionException extends Error {
  constructor(detail?: string) {
    super(`Invalid File Extension!${detail ? `, detail: ${detail}` : ''}`);
  }
}
