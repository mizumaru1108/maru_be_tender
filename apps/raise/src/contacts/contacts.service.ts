import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { MessageDto } from './message.dto';
import { rootLogger } from '../logger';
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
  private logger = rootLogger.child({ logger: ContactsService.name });

  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    // private mailerService: MailerService,
    private emailService: EmailService,
    @InjectModel(Notifications.name)
    private notificationsModel: Model<NotificationsDocument>,
  ) {}

  async sendMail(message: MessageDto) {
    let txtMessage = 'Oops an error occurred, email failed to send';
    let success = false;
    let statusCode = 400;
    const organizationId = message.organizationId;
    if (organizationId) {
      this.logger.debug('find organization...');
      const filter = { _id: organizationId };
      const organizationData = await this.organizationModel.findOne(filter, {});
      //console.log(organizationData);
      if (organizationData) {
        const donorSendEmailParams: SendEmailDto = {
          to: organizationData.contactEmail, // change to your email to test, ex: rdanang.dev@gmail.com, default value is registeredUser.email
          subject: 'Donor has sent you an Email',
          mailType: 'template',
          templatePath: 'email',
          templateContext: {
            name: message.name,
            email: message.email,
            help_message: message.help_message,
          },
          attachments: [...message.files],
          from: 'hello@tmra.io', // we can make it dynamic when new AWS SESW identity available
        };

        await this.emailService.sendMail(donorSendEmailParams);

        const letUsKnowParams: SendEmailDto = {
          to: message.email, // change to your email to test, ex: rdanang.dev@gmail.com, default value is registeredUser.email
          subject: 'Thanks for letting us know',
          mailType: 'template',
          templatePath: 'donor',
          templateContext: {
            name: message.name,
            email: message.email,
            help_message: message.help_message,
          },
          attachments: [...message.files],
          from: 'hello@tmra.io', // we can make it dynamic when new AWS SESW identity available
        };

        await this.emailService.sendMail(letUsKnowParams);

        this.notificationsModel.create({
          organizationId: new Types.ObjectId(organizationId),
          type: 'general',
          createdAt: new Date(),
          title: 'Donor has sent you an Email!',
          body: `Please check your inbox...`,
          icon: 'message',
          markAsRead: false,
        });

        success = true;
        statusCode = 200;
        txtMessage = 'Your email has been sent';
      }
    }

    return {
      success: success,
      status: statusCode,
      message: txtMessage,
      data: message,
    };
  }
}
