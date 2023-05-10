import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { MailerService } from '@nestjs-modules/mailer';
import { MessageDto } from './message.dto';
import { ROOT_LOGGER } from '../libs/root-logger';
import { Types } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from 'src/organization/schema/organization.schema';
import {
  Notifications,
  NotificationsDocument,
} from 'src/organization/schema/notifications.schema';
import { CommonNotificationMapperResponse } from 'src/tender-commons/dto/common-notification-mapper-response.dto';
import moment from 'moment';
import { TenderNotificationService } from 'src/tender-notification/services/tender-notification.service';

@Injectable()
export class ContactsService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ContactsService.name,
  });

  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    // private emailService: EmailService,
    @InjectModel(Notifications.name)
    private notificationsModel: Model<NotificationsDocument>,
    private readonly notificationService: TenderNotificationService,
  ) {}

  async sendMail(message: MessageDto) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const organization_id = message.organizationId;

    if (!organization_id) {
      throw new HttpException(
        'Request rejected organizationId is required!',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      this.logger.debug('find organization...');
      const getOrganization = await this.organizationModel.findOne({
        _id: ObjectId(organization_id),
      });

      if (!getOrganization) {
        throw new HttpException(
          'Organization not found!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const notifPayload: CommonNotificationMapperResponse = {
        logTime: moment(new Date().getTime()).format('llll'),
        generalHostEmail: 'tmra',
        clientSubject: 'Thanks for letting us know!',
        clientId: [],
        clientEmail: [message.email],
        clientMobileNumber: [],
        clientEmailTemplatePath: `gs/en/contact/submiter_contact_us`,
        clientEmailTemplateContext: [
          {
            donor_email: message.email,
            donor_name: message.name,
          },
        ],
        clientContent: 'Thanks for letting us know',
        reviewerId: [],
        reviewerEmail: [getOrganization.contactEmail],
        reviewerEmailTemplatePath: `gs/en/contact/receiver_contact_us`,
        reviewerEmailTemplateContext: [
          {
            fullName: message.name,
            email: message.email,
            message: message.help_message,
            emailHost: 'hello@tmra.io',
          },
        ],
        reviewerContent: 'Donor has sent you an Email',
        reviewerMobileNumber: [],
        reviwerSubject:
          'Donor has sent you an Email! Please check your inbox...`',
        createManyWebNotifPayload: [],
      };

      this.notificationService.sendSmsAndEmailBatch(notifPayload);

      const createNotif = await this.notificationsModel.create({
        organizationId: new Types.ObjectId(organization_id),
        type: 'general',
        createdAt: new Date().toISOString(),
        title: 'Donor has sent you an Email!',
        body: `Please check your inbox...`,
        icon: 'message',
        markAsRead: false,
      });

      if (!createNotif) {
        throw new HttpException(
          'Error when creating notif to mongo',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        organization_id: getOrganization._id,
        submiter_email: message.email,
        receiver_email: notifPayload.reviewerEmail,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
