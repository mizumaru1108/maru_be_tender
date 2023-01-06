import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
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
}
