import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
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
import { EmailService } from '../libs/email/email.service';
import { SendEmailDto } from '../libs/email/dtos/requests/send-email.dto';

@Injectable()
export class ContactsService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ContactsService.name,
  });

  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    // private mailerService: MailerService,
    private emailService: EmailService,
    @InjectModel(Notifications.name)
    private notificationsModel: Model<NotificationsDocument>,
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

      const donorSendEmailParams: SendEmailDto = {
        to: getOrganization.contactEmail,
        subject: 'Donor has sent you an Email',
        mailType: 'template',
        templatePath: 'email',
        templateContext: {
          name: message.name,
          email: message.email,
          help_message: message.help_message,
        },
        attachments: message.files ? message.files : [],
        from: 'hello@tmra.io',
      };

      const resEmailToOrg = await this.emailService.sendMail(
        donorSendEmailParams,
      );

      const letUsKnowParams: SendEmailDto = {
        to: message.email,
        subject: 'Thanks for letting us know',
        mailType: 'template',
        templatePath: 'email',
        templateContext: {
          name: message.name,
          email: message.email,
          help_message: message.help_message,
        },
        attachments: message.files ? message.files : [],
        from: getOrganization.contactEmail,
      };

      const resEmailToDonor = await this.emailService.sendMail(letUsKnowParams);

      await this.notificationsModel.create({
        organizationId: new Types.ObjectId(organization_id),
        type: 'general',
        createdAt: new Date().toISOString(),
        title: 'Donor has sent you an Email!',
        body: `Please check your inbox...`,
        icon: 'message',
        markAsRead: false,
      });

      return {
        email_to_org: resEmailToOrg,
        email_to_donor: resEmailToDonor,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
