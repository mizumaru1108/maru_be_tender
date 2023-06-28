export class FusionAuthPasswordlessLoginErrorException extends Error {
  constructor(detail?: string) {
    super(`Fusionauth Passwordless Login Error${detail ? `, ${detail}` : ''}`);
  }
}
