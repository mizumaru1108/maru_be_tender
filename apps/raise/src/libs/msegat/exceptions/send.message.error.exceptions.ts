export class MsegatSendingMessageError extends Error {
  constructor(phone: string) {
    super(`Something went wrong when sending sms to ${phone}`);
  }
}
