import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dtos/requests/send-email.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * Send email Services
 * @author Rdanang (Iyoy)
 */
@Injectable()
export class EmailService {
  @InjectPinoLogger(EmailService.name) private logger: PinoLogger;

  constructor(private mailerService: MailerService) {}

  /**
   * SendMail Services,
   * used to send email to user with attachment,
   */
  async sendMailAsync(sendMailDto: SendEmailDto) {
    const {
      to,
      mailType,
      cc,
      subject,
      from,
      content,
      templatePath,
      templateContext,
      attachments,
    } = sendMailDto;
    this.logger.info(`Sending [%j] email to %j`, mailType, to);

    const param: ISendMailOptions = {
      to: to,
      from: from ? from : 'no-reply@hcharity.org',
    };

    if (mailType === 'plain') {
      if (!content) {
        throw new BadRequestException('content is required for plain mail');
      }
      param.html = `<div>${content}</div>`;
    }

    if (mailType === 'template') {
      if (!templatePath) {
        throw new BadRequestException(
          'templatePath is required for template mail',
        );
      }
      if (templatePath && !templateContext) {
        throw new BadRequestException(
          'templateContext is required for template mail',
        );
      }
      param.context = templateContext;
      param.template = templatePath;
    }

    if (subject) param.subject = subject;
    if (cc) param.cc = cc;
    if (attachments) param.attachments = attachments;

    try {
      const emailLogs = await this.mailerService.sendMail(param);
      // console.log(emailLogs);
      return emailLogs;
    } catch (error) {
      console.trace(error);
      // if error is instance of bad request exception
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Something when wrong when sending email!',
        );
      }
    }
  }

  /**
   * SendMail Services,
   * without await TOOD: need to be refactored with REDIS for queue
   */
  sendMail(sendMailDto: SendEmailDto) {
    const {
      to,
      mailType,
      cc,
      subject,
      from,
      content,
      templatePath,
      templateContext,
      attachments,
    } = sendMailDto;
    this.logger.info(`Sending [%j] email to %j`, mailType, to);
    // console.log(`Sending email to ${to}`);

    const param: ISendMailOptions = {
      to: to,
      from: from ? from : 'no-reply@hcharity.org',
    };

    if (mailType === 'plain') {
      if (!content) {
        throw new BadRequestException('content is required for plain mail');
      }
      param.html = `<div>${content}</div>`;
    }

    if (mailType === 'template') {
      if (!templatePath) {
        throw new BadRequestException(
          'templatePath is required for template mail',
        );
      }
      if (templatePath && !templateContext) {
        throw new BadRequestException(
          'templateContext is required for template mail',
        );
      }
      param.context = templateContext;
      param.template = templatePath;
    }

    if (subject) param.subject = subject;
    if (cc) param.cc = cc;
    if (attachments) param.attachments = attachments;

    // TODO: CONNECT TO REDIS FOR QUEUE
    const emailLogs = this.mailerService.sendMail(param);
    return emailLogs;
  }

  /* DEPRECATED */
  async sendMailWTemplate(
    to: string,
    subject: string,
    template: string,
    data: Record<string, any>,
    from?: string,
  ): Promise<boolean> {
    this.logger.debug(`Sending email with template to ${to}`);
    try {
      const resp = await this.mailerService.sendMail({
        to: to,
        subject: subject,
        template: template,
        context: data,
        from: from ? from : 'no-reply@hcharity.org',
      });
      console.log(resp);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }

  /* DEPRECATED */
  async sendMailWTemplateAndAttachment(
    to: string,
    subject: string,
    template: string,
    data: Record<string, any>,
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
        from: from ? from : 'no-reply@hcharity.org',
      });
      console.log(resp);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
    return true;
  }
}
