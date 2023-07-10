import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MsegatService } from 'src/libs/msegat/services/msegat.service';
import { TenderNotificationErrorLogRepository } from 'src/notification-management/failed-logs/repositories/notification.errror.log.repository';
export class NotificationSendSmsCommand {
  type: 'SMS' | 'EMAIL';
  user_id: string;
  phone_number: string;
  content: string;
  subject: string;
}

@CommandHandler(NotificationSendSmsCommand)
export class NotificationSendSmsCommandHandler
  implements ICommandHandler<NotificationSendSmsCommand>
{
  private readonly MAX_RETRY_COUNT = 3;

  constructor(
    private readonly failLogRepo: TenderNotificationErrorLogRepository,
    private readonly msegatService: MsegatService,
  ) {}

  async sendSms(command: NotificationSendSmsCommand) {
    // await asyncRetry(
    //   async (bail: (error: Error) => void) => {
    //     try {
    //       await this.msegatService.sendSMSAsync({
    //         numbers: command.phone_number.includes('+')
    //           ? command.phone_number.substring(1)
    //           : command.phone_number,
    //         msg: command.subject + command.content,
    //       });
    //     } catch (error) {
    //       // If the error is non-retryable, pass it to the bail function
    //       // to abort the retry attempts
    //       if (this.shouldAbortRetry(error)) {
    //         bail(error);
    //       }
    //       throw error;
    //     }
    //   },
    //   {
    //     retries: this.MAX_RETRY_COUNT,
    //     minTimeout: 1000, // Minimum delay between retries (in milliseconds)
    //     factor: 2, // The exponential factor to increase the delay between retries
    //     onRetry: (error: Error) => {
    //       // Log or handle the retry attempt here
    //       console.error(`Error sending SMS: ${error.message}`);
    //     },
    //   },
    // );
  }

  shouldAbortRetry(error: Error): boolean {
    // Implement your own logic here to determine if the error is non-retryable
    // Return true to abort further retry attempts for this error
    // Return false to continue retrying
    return false;
  }

  async execute(command: NotificationSendSmsCommand): Promise<any> {
    try {
      await this.sendSms(command);
      // Handle successful SMS sending here
    } catch (error) {
      // Handle failed SMS sending here
      console.error('Failed to send SMS:', error);
      // if (this.retryCount === this.MAX_RETRY_COUNT) {
      //   // Log or handle the maximum retry attempts here
      //   console.error('Exceeded maximum retry attempts for sending SMS.');
      //   // ... additional error handling or logging ...
      // } else {
      //   // Retry the sendSms operation
      //   console.log('Retrying sending SMS...');
      //   await this.execute(command);
      // }
    }
  }
}
