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
import { EmailService } from '../../../libs/email/email.service';
import { MsegatService } from '../../../libs/msegat/services/msegat.service';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';
import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { CommonNotifMapperResponse } from '../../../tender-commons/dto/common-notif-mapper-response.dto';
import { CommonNotificationMapperResponse } from '../../../tender-commons/dto/common-notification-mapper-response.dto';

@Injectable()
export class TenderNotificationService {
  constructor(
    private readonly tenderNotificationRepository: TenderNotificationRepository,
    private readonly emailService: EmailService,
    private readonly msegatService: MsegatService, // private readonly twilioService: TwilioService,
  ) {}

  async create(payload: CreateNotificationDto) {
    const notification = createNotificationMapper(payload);
    await this.tenderNotificationRepository.createNotification(notification);
    return {
      createdNotification: payload,
    };
  }

  async createMany(payload: CreateManyNotificationDto) {
    const createNotificationPayloads: Prisma.notificationCreateManyInput[] =
      createManyNotificationMapper(payload);
    await this.tenderNotificationRepository.createManyNotification(
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

  async delete(userId: string, notificationId: string) {
    const response = await this.tenderNotificationRepository.findById(
      notificationId,
    );
    if (!response) throw new NotFoundException('Notification not found');
    if (response.user_id !== userId) {
      throw new ForbiddenException("This notification aren't yours");
    }
    const updatedNotif = await this.tenderNotificationRepository.deleteById(
      notificationId,
    );
    return updatedNotif;
  }

  async deleteAllMine(userId: string) {
    return await this.tenderNotificationRepository.deleteAllMine(userId);
  }

  sendSmsAndEmail(notifPayload: CommonNotifMapperResponse) {
    const {
      subject,
      clientContent,
      clientEmail,
      clientMobileNumber,
      clientEmailTemplatePath,
      clientEmailTemplateContext,
      reviewerContent,
      reviewerEmail,
      reviewerMobileNumber,
      reviewerEmailTemplateContext,
      reviewerEmailTemplatePath,
    } = notifPayload;

    const baseSendEmail: Omit<SendEmailDto, 'to' | 'mailType'> = {
      subject,
      from: 'no-reply@hcharity.org',
    };

    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      mailType:
        clientEmailTemplateContext && clientEmailTemplatePath
          ? 'template'
          : 'plain',
      to: clientEmail,
    };
    if (clientEmailNotif.mailType === 'plain') {
      clientEmailNotif.content = clientContent;
    }
    if (clientEmailTemplateContext && clientEmailTemplatePath) {
      clientEmailNotif.templateContext = clientEmailTemplateContext;
      clientEmailNotif.templatePath = clientEmailTemplatePath;
    }
    this.emailService.sendMail(clientEmailNotif);

    /* enable when msgat is already exist */
    // const clientPhone = isExistAndValidPhone(clientMobileNumber);
    // if (clientPhone) {
    //   this.twilioService.sendSMS({
    //     to: clientPhone,
    //     body: subject + ', ' + clientContent,
    //   });
    // }

    if (reviewerContent) {
      if (reviewerEmail && reviewerEmail !== '') {
        const reviewerEmailNotif: SendEmailDto = {
          ...baseSendEmail,
          mailType:
            reviewerEmailTemplateContext && reviewerEmailTemplatePath
              ? 'template'
              : 'plain',
          to: reviewerEmail,
        };

        if (reviewerEmailNotif.mailType === 'plain') {
          reviewerEmailNotif.content = reviewerContent
            ? reviewerContent
            : clientContent;
        }

        if (reviewerEmailTemplateContext && reviewerEmailTemplatePath) {
          clientEmailNotif.templateContext = reviewerEmailTemplateContext;
          clientEmailNotif.templatePath = reviewerEmailTemplatePath;
        }
        this.emailService.sendMail(reviewerEmailNotif);
      }

      /* enable when msgat is already exist */
      // if (reviewerMobileNumber && reviewerMobileNumber !== '') {
      //   const reviewerPhone = isExistAndValidPhone(reviewerMobileNumber);
      //   if (reviewerPhone) {
      //     this.twilioService.sendSMS({
      //       to: reviewerPhone,
      //       body: subject + ', ' + reviewerContent,
      //     });
      //   }
      // }
    }
  }

  async sendSmsAndEmailBatch(
    notifPayload: CommonNotificationMapperResponse,
    sendClientMail: boolean = true,
    sendClientSms: boolean = true,
    sendReviwerMail: boolean = true,
    sendReviwerSms: boolean = true,
  ) {
    try {
      const {
        clientSubject,
        clientContent,
        clientEmail,
        clientMobileNumber,
        clientEmailTemplatePath,
        clientEmailTemplateContext,
        reviwerSubject,
        reviewerContent,
        reviewerEmail,
        reviewerMobileNumber,
        reviewerEmailTemplateContext,
        reviewerEmailTemplatePath,
        clientAttachmentFiles,
        generalHostEmail,
      } = notifPayload;

      const baseSendEmail: Omit<SendEmailDto, 'to' | 'mailType'> = {
        subject: clientSubject,
        from:
          generalHostEmail && generalHostEmail === 'tmra'
            ? 'hello@tmra.io' // no-reply@tmra.io
            : 'no-reply@hcharity.org',
        attachments:
          clientAttachmentFiles && clientAttachmentFiles.length
            ? clientAttachmentFiles
            : [],
      };

      // console.log(logUtil(notifPayload));

      if (sendClientMail) {
        if (clientEmail && clientEmail.length > 0) {
          for (let i = 0; i < clientEmail.length; i++) {
            if (clientEmail[i] !== '') {
              const clientEmailNotif: SendEmailDto = {
                ...baseSendEmail,
                mailType:
                  clientEmailTemplateContext && clientEmailTemplatePath
                    ? 'template'
                    : 'plain',
                to: clientEmail[i],
              };

              if (clientEmailNotif.mailType === 'plain') {
                clientEmailNotif.content = clientContent;
                if (clientEmailNotif.content !== '') {
                  this.emailService.sendMail(clientEmailNotif);
                }
              }

              if (clientEmailTemplateContext && clientEmailTemplatePath) {
                clientEmailNotif.templateContext =
                  clientEmailTemplateContext[i];
                clientEmailNotif.templatePath = clientEmailTemplatePath;
                this.emailService.sendMail(clientEmailNotif);
              }
            }
          }
        }
      }

      if (sendClientSms) {
        if (clientMobileNumber && clientMobileNumber.length > 0) {
          for (const clientMobile of clientMobileNumber) {
            if (clientMobile !== '' && clientContent !== '') {
              const clientPhone = isExistAndValidPhone(clientMobileNumber);
              if (clientPhone) {
                await this.msegatService.sendSMSAsync({
                  numbers: clientPhone.includes('+')
                    ? clientPhone.substring(1)
                    : clientPhone,
                  msg: clientSubject + ', ' + clientContent,
                });
              }
            }
          }
        }
      }

      if (sendReviwerMail) {
        if (reviewerContent && reviewerContent !== '') {
          if (reviewerEmail && reviewerEmail.length > 0) {
            for (let i = 0; i < reviewerEmail.length; i++) {
              if (reviewerEmail[i] !== '') {
                const reviewerEmailNotif: SendEmailDto = {
                  ...baseSendEmail,
                  subject: reviwerSubject ? reviwerSubject : clientSubject,
                  mailType:
                    reviewerEmailTemplateContext && reviewerEmailTemplatePath
                      ? 'template'
                      : 'plain',
                  to: reviewerEmail[i],
                };

                if (reviewerEmailNotif.mailType === 'plain') {
                  reviewerEmailNotif.content = reviewerContent
                    ? reviewerContent
                    : clientContent;
                  if (reviewerContent !== '') {
                    this.emailService.sendMail(reviewerEmailNotif);
                  }
                }

                if (reviewerEmailTemplateContext && reviewerEmailTemplatePath) {
                  reviewerEmailNotif.templateContext =
                    reviewerEmailTemplateContext[i];
                  reviewerEmailNotif.templatePath = reviewerEmailTemplatePath;
                  this.emailService.sendMail(reviewerEmailNotif);
                }
              }
            }
          }
        }

        /* enable when msgat is already exist */
        if (sendReviwerSms) {
          if (reviewerMobileNumber && reviewerMobileNumber.length > 0) {
            for (const reviewerMobile of reviewerMobileNumber) {
              if (reviewerMobile !== '' && reviewerContent !== '') {
                const reviewerPhone = isExistAndValidPhone(reviewerMobile);
                if (reviewerPhone) {
                  await this.msegatService.sendSMSAsync({
                    numbers: reviewerPhone.includes('+')
                      ? reviewerPhone.substring(1)
                      : reviewerPhone,
                    msg: reviwerSubject + ', ' + reviewerContent,
                  });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
