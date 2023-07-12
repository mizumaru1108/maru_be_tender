import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { NotificationFailedLogEntity } from 'src/notification-management/failed-logs/entities/notification.failed.log.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
export class NotificationFailedLogCreateProps {
  id?: string;
  type: 'EMAIL' | 'SMS';
  error_log: string;
  content: string;
  subject: string;
  user_id: string;
  email?: string | null;
  phone?: string | null;
}
@Injectable()
export class TenderNotificationFailedLogRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: NotificationFailedLogCreateProps,
    session?: PrismaService,
  ): Promise<NotificationFailedLogEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.notificationFailedLogs.create({
        data: {
          id: props.id || uuidv4(),
          type: props.type,
          error_log: props.error_log,
          content: props.content,
          subject: props.subject,
          user_id: props.user_id,
          email: props.email,
          phone: props.phone,
        },
      });

      const createdEntity = Builder<NotificationFailedLogEntity>(
        NotificationFailedLogEntity,
        {
          ...rawCreated,
        },
      ).build();
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
