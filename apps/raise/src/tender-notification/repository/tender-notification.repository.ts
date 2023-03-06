import { Injectable } from '@nestjs/common';
import { notification, Prisma } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderNotificationRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderNotificationRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async create(notification: Prisma.notificationCreateInput) {
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

  async createMany(notifications: Prisma.notificationCreateManyInput[]) {
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

  async readByUserId(userId: string) {
    try {
      return await this.prismaService.notification.updateMany({
        where: {
          user_id: userId,
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

  async deleteAllMine(userId: string) {
    try {
      return await this.prismaService.notification.deleteMany({
        where: {
          user_id: userId,
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
}
