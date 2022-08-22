import { Injectable } from '@nestjs/common';
import { rootLogger } from '../../logger';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private logger = rootLogger.child({ logger: EmailService.name });

  constructor(private mailerService: MailerService) {}

  /**
   * SendMail Services,
   * used to send email to user,
   * @param to email address of the user
   * @param subject subject of the email
   * @param template hbs template of the email
   * @param data data to be passed to the template
   * @param from sender address of the email, (default: "hello@tamra.io")
   */
  async sendMail(
    to: string,
    subject: string,
    template: string,
    data: {},
    from?: string,
  ) {
    let txtMessage = 'Oops an error occurred, email failed to send';
    let success = false;
    let statusCode = 400;
    if (subject && template && data) {
      const resp = await this.mailerService.sendMail({
        // to: organizationData['contactEmail'],
        to: to,
        subject: subject,
        template: template,
        context: data,
        from: from ? from : 'hello@tmra.io',
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
