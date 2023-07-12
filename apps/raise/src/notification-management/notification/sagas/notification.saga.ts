import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { map, Observable } from 'rxjs';
import { CreateNotificationEvent } from '../event/create.notification.event';
import { NotificationSendEmailCommand } from '../commands/notification.send.email/notification.send.email.command';
import { NotificationSendSmsCommand } from '../commands/notification.send.sms/notification.send.sms.command';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';

@Injectable()
export class NotificationSaga {
  private readonly logger = new Logger(NotificationSaga.name);

  @Saga()
  create(events$: Observable<any>): Observable<ICommand> {
    return events$.pipe(
      ofType(CreateNotificationEvent),
      map((event) => {
        this.logger.debug(`Create notif event triggered ${event.type}`);
        switch (event.type) {
          case 'EMAIL':
            if (!event.email) {
              throw new PayloadErrorException(
                `Email is needed when sending an email notificaition!`,
              );
            }
            const sendEmailNotifCommand = Builder<NotificationSendEmailCommand>(
              NotificationSendEmailCommand,
              {
                ...event,
              },
            );
            return sendEmailNotifCommand.build();
          case 'SMS':
            if (!event.phone_number) {
              throw new PayloadErrorException(
                `Phone number is needed when sending an sms notificaition!`,
              );
            }
            const sendSmsNotifCommand = Builder<NotificationSendSmsCommand>(
              NotificationSendSmsCommand,
              {
                ...event,
              },
            );
            return sendSmsNotifCommand.build();
          default:
            throw new PayloadErrorException(`Invalid Notification Event Type`);
        }
      }),
    );
  }
}
