import { Injectable } from '@nestjs/common';
import { rootLogger } from '../logger';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private logger = rootLogger.child({ logger: EmailService.name });

  constructor(private mailerService: MailerService) {}

  async sendMail(to: string, subject: string, template: string, data: {}) {
    let txtMessage = 'Oops an error occurred, email failed to send';
    let success = false;
    let statusCode = 400;
    if (subject && template && data) {
      const resp = await this.mailerService.sendMail({
        // to: organizationData['contactEmail'],
        to: 'hello.givingsadaqah@mailinator.com', // to
        subject: subject,
        template: template,
        context: data,
      });
      console.log(resp);
      success = true;
      statusCode = 200;
      txtMessage = 'Your email has been sent';
    }
    this.logger.debug(txtMessage);

    return {
      success: success,
      status: statusCode,
      message: txtMessage,
      data: data,
    };
  }
}
