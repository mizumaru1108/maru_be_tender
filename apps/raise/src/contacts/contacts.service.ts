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

@Injectable()
export class ContactsService {
  private logger = rootLogger.child({ logger: ContactsService.name });

  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private mailerService: MailerService,
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
      console.log(organizationData);
      if (organizationData) {
        const resp = await this.mailerService.sendMail({
          // to: organizationData['contactEmail'],
          to: 'hello.givingsadaqah@mailinator.com', // organizationData['contactEmail'],
          subject: 'Donor has sent you an Email',
          template: 'email',
          context: {
            name: message.name,
            email: message.email,
            help_message: message.help_message,
          },
          attachments: message.files,
        });
        console.log(resp);
        success = true;
        statusCode = 200;
        txtMessage = 'Your email has been sent';

        await this.mailerService.sendMail({
          // to: organizationData['contactEmail'],
          to: message.email, // organizationData['contactEmail'],
          subject: 'Thanks for letting us know',
          template: 'donor',
          context: {
            name: message.name,
          },
        });

        this.notificationsModel.create({
          organizationId: new Types.ObjectId(organizationId),
          type: 'general',
          createdAt: new Date(),
          title: 'Donor has sent you an Email!',
          body: `Please check your inbox...`,
          icon: 'message',
          markAsRead: false,
        });
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
