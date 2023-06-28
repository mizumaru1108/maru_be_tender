export class FusionAuthPasswordlessStartError extends Error {
  constructor(detail?: string) {
    super(`Fusionauth Passwordless Start Error${detail ? `, ${detail}` : ''}`);
  }
}
