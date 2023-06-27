export class UserAlreadyExistException extends Error {
  constructor(detail?: string) {
    super(`Oops.. already exist!${detail ? `, detail: ${detail}` : ''}`);
  }
}
