export class ForbiddenPermissionException extends Error {
  constructor(detail?: string) {
    super(
      `You are not authorized to use this action!${
        detail ? `, more detail: ${detail}` : ''
      }`,
    );
  }
}
