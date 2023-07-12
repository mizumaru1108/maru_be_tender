export class RequestErrorException extends Error {
  constructor(detail?: string) {
    super(`Request Error!${detail ? `, more detail: ${detail}` : ''}`);
  }
}
