export class InvalidFileSizeException extends Error {
  constructor(detail?: string) {
    super(`Invalid File Size!${detail ? `, detail: ${detail}` : ''}`);
  }
}
