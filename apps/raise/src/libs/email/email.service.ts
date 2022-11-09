import { Injectable } from '@nestjs/common';
import { rootLogger } from '../../logger';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private logger = rootLogger.child({ logger: EmailService.name });

  constructor(private mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    data: {},
    from?: string,
  ): Promise<boolean> {
    this.logger.debug(`Sending email to ${to}`);
    try {
      const resp = await this.mailerService.sendMail({
        to: to,
        subject: subject,
        context: data,
        from: from ? from : 'hello@tmra.io',
      });
      console.log(resp);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }

  async sendMailWAttachment(
    to: string,
    subject: string,
    data: {},
    attachment: any, // array of objects
    from?: string,
  ): Promise<boolean> {
    this.logger.debug(`Sending email to ${to}`);
    try {
      const resp = await this.mailerService.sendMail({
        to: to,
        subject: subject,
        context: data,
        attachments: attachment,
        from: from ? from : 'hello@tmra.io',
      });
      console.log(resp);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }

  /**
   * SendMail Services,
   * used to send email to user,
   * @param to email address of the user
   * @param subject subject of the email
   * @param template hbs template of the email
   * @param data data to be passed to the template
   * @param from sender address of the email, (default: "hello@tamra.io")
   * @returns {Promise<boolean>} returns true if email is sent successfully
   */
  async sendMailWTemplate(
    to: string,
    subject: string,
    template: string,
    data: {},
    from?: string,
  ): Promise<boolean> {
    this.logger.debug(`Sending email to ${to}`);
    try {
      const resp = await this.mailerService.sendMail({
        to: to,
        subject: subject,
        template: template,
        context: data,
        from: from ? from : 'hello@tmra.io',
      });
      console.log(resp);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }

  /**
   * SendMail Services,
   * used to send email to user with attachment,
   * @param to email address of the user
   * @param subject subject of the email
   * @param template hbs template of the email
   * @param data data to be passed to the template
   * @param attachment attachment to be sent with the email (array of objects)
   * @param from sender address of the email, (default: "hello@tamra.io")
   * @returns {Promise<boolean>} returns true if email is sent successfully
   */
  async sendMailWTemplateAndAttachment(
    to: string,
    subject: string,
    template: string,
    data: {},
    attachment: any, // array of objects
    from?: string,
  ): Promise<boolean> {
    this.logger.debug(`Sending email to ${to}`);
    try {
      const resp = await this.mailerService.sendMail({
        to: to,
        subject: subject,
        template: template,
        context: data,
        attachments: attachment,
        from: from ? from : 'hello@tmra.io',
      });
      console.log(resp);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }
}
