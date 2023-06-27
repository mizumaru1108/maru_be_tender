export class FusionAuthRegisterError extends Error {
  constructor(detail?: string) {
    super(`Register Error${detail ? `, ${detail}` : ''}`);
  }
}
