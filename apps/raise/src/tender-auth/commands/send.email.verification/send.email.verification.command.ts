import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../libs/email/email.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { DataNotFoundException } from '../../../tender-commons/exceptions/data-not-found.exception';

export class SendEmailVerificationClassCommand {
  email: string;
  selectLang: 'en' | 'ar';
}

@CommandHandler(SendEmailVerificationClassCommand)
export class SendEmailVerificationClassCommandHandler
  implements ICommandHandler<SendEmailVerificationClassCommand>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: SendEmailVerificationClassCommand): Promise<any> {
    try {
      const { email, selectLang } = command;
      const loginCode = await this.fusionAuthService.passwordlessLoginStart(
        email,
      );
      if (typeof loginCode !== 'number') {
        // check that email has been verified / not
        const loginResponse = await this.fusionAuthService.passwordlessLogin(
          loginCode,
        );

        // console.log('login response send email verif', loginResponse);

        if (!loginResponse.user) {
          throw new DataNotFoundException('User Data Not Found!');
        }

        if (loginResponse.user.verified) {
          return 'user already verified!';
        }

        const emailVerifiedToken =
          await this.fusionAuthService.passwordlessLoginStart(email);

        this.emailService.sendMail({
          mailType: 'template',
          to: email,
          from: 'no-reply@hcharity.org',
          subject: 'Verrify Your Email',
          templateContext: {
            name: `${email}`,
            verify_url: `${this.configService.get<string>(
              'tenderAppConfig.baseUrl',
            )}/auth/verify/${emailVerifiedToken}`,
          },
          templatePath: `tender/${
            selectLang || 'ar'
          }/account/verify_your_email`,
        });

        return 'email verification sent';
      }
    } catch (error) {
      throw error;
    }
  }
}
