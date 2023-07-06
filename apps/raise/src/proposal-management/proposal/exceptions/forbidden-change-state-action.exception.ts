export class ForbiddenChangeStateActionException extends Error {
  constructor(actionName?: string) {
    super(
      actionName
        ? `You are not allowed to perform this action (${actionName}) !`
        : 'You are not allowed to perform this action!',
    );
  }
}
