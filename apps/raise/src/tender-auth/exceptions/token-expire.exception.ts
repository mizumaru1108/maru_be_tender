export class TokenExpiredException extends Error {
  constructor() {
    super(`Invalid/Expired Token !`);
  }
}
