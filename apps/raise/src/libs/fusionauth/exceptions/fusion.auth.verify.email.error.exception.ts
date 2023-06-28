export class FusionAuthVerifyEmailErrorException extends Error {
  constructor(detail?: string) {
    super(`Fusionauth verify email error!${detail ? `, ${detail}` : ''}`);
  }
}
