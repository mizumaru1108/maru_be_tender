import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async read(userId: string, notificationId: string) {
    const response = await this.tenderNotificationRepository.findById(
      notificationId,
    );
    if (!response) throw new NotFoundException('Notification not found');
    if (response.user_id !== userId) {
      throw new ForbiddenException("This notification aren't yours");
    }
    const updatedNotif = await this.tenderNotificationRepository.readById(
      notificationId,
    );
    return updatedNotif;
  }

  async readMine(userId: string) {
    return await this.tenderNotificationRepository.readByUserId(userId);
  }

  async hide(userId: string, notificationId: string) {
    const response = await this.tenderNotificationRepository.findById(
      notificationId,
    );
    if (!response) throw new NotFoundException('Notification not found');
    if (response.user_id !== userId) {
      throw new ForbiddenException("This notification aren't yours");
    }
    const updatedNotif = await this.tenderNotificationRepository.hideById(
      notificationId,
    );
    return updatedNotif;
  }

  async hideAllMine(userId: string) {
    return await this.tenderNotificationRepository.hideAllMine(userId);
  }
}
