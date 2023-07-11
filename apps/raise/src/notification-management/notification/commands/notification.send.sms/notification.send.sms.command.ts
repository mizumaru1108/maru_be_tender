import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MsegatService } from 'src/libs/msegat/services/msegat.service';
import { TenderNotificationFailedLogRepository } from 'src/notification-management/failed-logs/repositories/notification.errror.log.repository';
import asyncRetry from 'async-retry';
import { Logger } from '@nestjs/common';
import { logUtil } from 'src/commons/utils/log-util';

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
  private readonly logger = new Logger(NotificationSendSmsCommandHandler.name);

  constructor(
    private readonly failLogRepo: TenderNotificationFailedLogRepository,
    private readonly msegatService: MsegatService,
  ) {}

  async sendSms(command: NotificationSendSmsCommand) {
    let retryCount = 0; // Track the number of retries
    let lastError: Error | undefined; // Track the last error object
    this.logger.debug(
      `send sms command triggered, payload ${logUtil(command)}`,
    );

    await asyncRetry(
      async () => {
        await this.msegatService.sendSMSAsync({
          numbers: command.phone_number.includes('+')
            ? command.phone_number.substring(1)
            : command.phone_number,
          msg: command.subject + command.content,
        });
        retryCount = 0; // Reset the retry count on successful attempt
        lastError = undefined; // Reset the last error
      },
      {
        retries: this.MAX_RETRY_COUNT,
        minTimeout: 1000, // Minimum delay between retries (in milliseconds)
        factor: 2, // The exponential factor to increase the delay between retries
        onRetry: (error: Error) => {
          // Log or handle the retry attempt here
          console.error(`Error sending SMS(${retryCount}): ${error.message}`);
          retryCount++;
          lastError = error; // Capture the last error object
        },
      },
    );

    if (retryCount === this.MAX_RETRY_COUNT) {
      // Create a log using failLogRepo.create after three unsuccessful retries
      await this.failLogRepo.create({
        type: 'SMS',
        user_id: command.user_id,
        content: command.content,
        subject: command.subject,
        error_log: JSON.stringify(lastError?.message) || '', // Get the error message
      });
    }
  }

  async execute(command: NotificationSendSmsCommand): Promise<any> {
    try {
      await this.sendSms(command);
      // Handle successful SMS sending here
    } catch (error) {
      // Handle failed SMS sending here
      console.error('Failed to send SMS:', error);
    }
  }
}
