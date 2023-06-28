import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { EmailService } from '../../../libs/email/email.service';
import { ConfigService } from '@nestjs/config';
import { DataNotFoundException } from '../../../tender-commons/exceptions/data-not-found.exception';
import { EmailAlreadyVerifiedException } from '../../../tender-user/user/exceptions/email-already-verified.exception';
import { TokenExpiredException } from '../../exceptions/token-expire.exception';
import { ROOT_LOGGER } from '../../../libs/root-logger';

export class VerifyEmailCommand {
  token: string;
  selectLang: 'en' | 'ar';
}

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler
  implements ICommandHandler<VerifyEmailCommand>
{
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': VerifyEmailCommandHandler.name,
  });
  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<any> {
    const { token } = command;
    try {
      const loginResponse = await this.fusionAuthService.passwordlessLogin(
        token,
      );
      // console.log('verify email login response', loginResponse);

      if (!loginResponse) {
        throw new TokenExpiredException();
      }

      if (!loginResponse.user) {
        throw new DataNotFoundException('User Data Not Found!');
      }

      if (loginResponse.user.verified) {
        throw new EmailAlreadyVerifiedException(
          `${loginResponse.user.email} already verified!`,
        );
      }

      await this.fusionAuthService.verifyEmail(loginResponse.user.id);

      this.emailService.sendMail({
        mailType: 'template',
        to: loginResponse.user.email,
        from: 'no-reply@hcharity.org',
        subject: 'Email Verified',
        templateContext: {
          user_email: loginResponse.user.email,
          app_url: `${this.configService.get<string>(
            'tenderAppConfig.baseUrl',
          )}`,
        },
        templatePath: `tender/${
          command.selectLang || 'ar'
        }/account/email_verified`,
      });
      return 'user verified';
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
