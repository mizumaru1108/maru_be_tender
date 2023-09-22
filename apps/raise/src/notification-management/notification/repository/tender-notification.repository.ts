import { Injectable } from '@nestjs/common';
import { notification, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Builder } from 'builder-pattern';
import { NotificationEntity } from '../entities/notification.entity';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';

export class CreateNotificaitonProps {
  id?: string;
  user_id: string;
  subject: string;
  content: string;
  type: string;
  message_id?: string | null;
  proposal_id?: string | null;
  appointment_id?: string | null;
  specific_type?: string | null;
  read_status?: boolean | null;
}

@Injectable()
export class TenderNotificationRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderNotificationRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async create(props: CreateNotificaitonProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawNotif = await prisma.notification.create({
        data: {
          id: props.id || uuidv4(),
          user_id: props.user_id,
          subject: props.subject,
          content: props.content,
          type: props.type,
          proposal_id: props.proposal_id,
          message_id: props.message_id,
          appointment_id: props.appointment_id,
          specific_type: props.specific_type,
          read_status: props.read_status,
        },
      });

      const notifEntity = Builder<NotificationEntity>(NotificationEntity, {
        ...rawNotif,
      }).build();

      return notifEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
  async createNotification(notification: Prisma.notificationCreateInput) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.notification.create({
          data: notification,
        });
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'createSchedules error:',
        `creating schedule!`,
      );
      throw theError;
    }
  }

  async createManyNotification(
    notifications: Prisma.notificationCreateManyInput[],
  ) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.notification.createMany({
          data: notifications,
        });
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'createSchedules error:',
        `creating schedule!`,
      );
      throw theError;
    }
  }

  async findById(notificationId: string): Promise<notification | null> {
    try {
      return await this.prismaService.notification.findUnique({
        where: {
          id: notificationId,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'Find Notification error:',
        `Finding Notification!`,
      );
      throw theError;
    }
  }

  async readById(notificationId: string): Promise<notification> {
    try {
      return await this.prismaService.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          read_status: true,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'Read Notification error:',
        `Reading Notification!`,
      );
      throw theError;
    }
  }

  async readByUserId(userId: string, type?: 'notification' | 'message') {
    let notifClause: Prisma.notificationWhereInput = {};
    let andClause: Prisma.notificationWhereInput[] = [];

    andClause.push({ user_id: userId });

    if (type) {
      if (type === 'message') {
        andClause.push({
          specific_type: 'NEW_MESSAGE',
          read_status: false,
        });
      }

      if (type === 'notification') {
        andClause.push({
          specific_type: { notIn: ['NEW_MESSAGE'] },
          read_status: false,
        });
      }
    }

    notifClause.AND = andClause;

    try {
      return await this.prismaService.notification.updateMany({
        where: notifClause,
        data: {
          read_status: true,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'Read Notification error:',
        `Reading Notification!`,
      );
      throw theError;
    }
  }

  async hideById(notificationId: string): Promise<notification> {
    try {
      return await this.prismaService.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          shown: false,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'Read Notification error:',
        `Reading Notification!`,
      );
      throw theError;
    }
  }

  async hideAllMine(userId: string) {
    try {
      return await this.prismaService.notification.updateMany({
        where: {
          user_id: userId,
        },
        data: {
          shown: false,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'Read Notification error:',
        `Reading Notification!`,
      );
      throw theError;
    }
  }

  async deleteById(notificationId: string): Promise<notification> {
    try {
      return await this.prismaService.notification.delete({
        where: {
          id: notificationId,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'Read Notification error:',
        `Reading Notification!`,
      );
      throw theError;
    }
  }

  async deleteAllMine(userId: string, type?: 'notification' | 'message') {
    let notifClause: Prisma.notificationWhereInput = {};
    let andClause: Prisma.notificationWhereInput[] = [];

    andClause.push({ user_id: userId });

    if (type) {
      if (type === 'message') {
        andClause.push({
          specific_type: 'NEW_MESSAGE',
        });
      }

      if (type === 'notification') {
        andClause.push({
          specific_type: { notIn: ['NEW_MESSAGE'] },
        });
      }
    }

    notifClause.AND = andClause;

    try {
      return await this.prismaService.notification.deleteMany({
        where: notifClause,
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderNotificationRepository.name,
        'Read Notification error:',
        `Reading Notification!`,
      );
      throw theError;
    }
  }
}
