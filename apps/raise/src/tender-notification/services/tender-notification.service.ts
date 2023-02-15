import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isExistAndValidPhone } from '../../commons/utils/is-exist-and-valid-phone';
import { SendEmailDto } from '../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../libs/email/email.service';
import { TwilioService } from '../../libs/twilio/services/twilio.service';
import { CommonNotifMapperResponse } from '../../tender-commons/dto/common-notif-mapper-response.dto';
import { CreateManyNotificationDto } from '../dtos/requests/create-many-notification.dto';
import { CreateNotificationDto } from '../dtos/requests/create-notification.dto';
import { createManyNotificationMapper } from '../mappers/create-many-notification.mapper';
import { createNotificationMapper } from '../mappers/create-notification.mapper';
import { TenderNotificationRepository } from '../repository/tender-notification.repository';

@Injectable()
export class TenderNotificationService {
  constructor(
    private readonly tenderNotificationRepository: TenderNotificationRepository,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
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

  sendSmsAndEmail(notifPayload: CommonNotifMapperResponse) {
    const {
      subject,
      clientContent,
      clientEmail,
      clientMobileNumber,
      reviewerContent,
      reviewerEmail,
      reviewerMobileNumber,
    } = notifPayload;

    const baseSendEmail: Omit<SendEmailDto, 'to'> = {
      mailType: 'plain',
      from: 'no-reply@hcharity.org',
    };

    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      to: clientEmail,
      subject: subject,
      content: clientContent,
    };
    this.emailService.sendMail(clientEmailNotif);

    const clientPhone = isExistAndValidPhone(clientMobileNumber);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: subject + ', ' + clientContent,
      });
    }

    if (reviewerContent) {
      if (reviewerEmail && reviewerEmail !== '') {
        const reviewerEmailNotif: SendEmailDto = {
          ...baseSendEmail,
          to: reviewerEmail,
          subject: subject,
          content: reviewerContent,
        };
        this.emailService.sendMail(reviewerEmailNotif);
      }

      if (reviewerMobileNumber && reviewerMobileNumber !== '') {
        const reviewerPhone = isExistAndValidPhone(reviewerMobileNumber);
        if (reviewerPhone) {
          this.twilioService.sendSMS({
            to: reviewerPhone,
            body: subject + ', ' + reviewerContent,
          });
        }
      }
    }
  }
}
