import { Global, Module, Provider } from '@nestjs/common';
import { TenderNotificationController } from './notification/controllers/tender-notification.controller';
import { TenderNotificationService } from './notification/services/tender-notification.service';
import { TenderNotificationRepository } from './notification/repository/tender-notification.repository';
import { NotificationSendSmsCommandHandler } from './notification/commands/notification.send.sms/notification.send.sms.command';
import { NotificationSendEmailCommandHandler } from './notification/commands/notification.send.email/notification.send.email.command';
import { CqrsModule } from '@nestjs/cqrs';

const importedModules = [CqrsModule];

const commands: Provider[] = [
  NotificationSendSmsCommandHandler,
  NotificationSendEmailCommandHandler,
];

const services: Provider[] = [TenderNotificationService];

const repositories: Provider[] = [TenderNotificationRepository];

const exportedProvider: Provider[] = [
  TenderNotificationService,
  TenderNotificationRepository,
];

@Global()
@Module({
  imports: [...importedModules],
  controllers: [TenderNotificationController],
  providers: [...commands, ...services, ...repositories],
  exports: [...exportedProvider],
})
export class NotificationManagementModule {}
