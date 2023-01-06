import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateManyNotificationDto } from '../dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../mappers/create-many-notification.mapper';
import { createNotificationMapper } from '../mappers/create-notification.mapper';
import { TenderNotificationRepository } from '../repository/tender-notification.repository';

@Injectable()
export class TenderNotificationService {
  constructor(
    private readonly tenderNotificationRepository: TenderNotificationRepository,
  ) {}

  async create(payload: CreateNotificationDto) {
    const notification = createNotificationMapper(payload);
    await this.tenderNotificationRepository.create(notification);
    return {
      createdNotification: payload,
    };
  }

  async createMany(payload: CreateManyNotificationDto) {
    const createNotificationPayloads: Prisma.notificationCreateManyInput[] =
      createManyNotificationMapper(payload);
    await this.tenderNotificationRepository.createMany(
      createNotificationPayloads,
    );
    return {
      createdNotification: payload,
    };
  }
}
