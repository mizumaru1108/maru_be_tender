import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { BadRequestException } from '@nestjs/common';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { EmailService } from '../../../libs/email/email.service';
import { ConfigService } from '@nestjs/config';
export class ResetPasswordRequestCommand {
  email: string;
  forgotPassword: boolean;
  selected_language?: 'ar' | 'en';
}

export class ResetPasswordRequestCommandResult {
  data: string;
}

@CommandHandler(ResetPasswordRequestCommand)
export class ResetPasswordRequestCommandHandler
  implements
    ICommandHandler<
      ResetPasswordRequestCommand,
      ResetPasswordRequestCommandResult
    >
{
  constructor(
    private readonly userRepo: TenderUserRepository,
    private readonly fusionAuthService: FusionAuthService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    command: ResetPasswordRequestCommand,
  ): Promise<ResetPasswordRequestCommandResult> {
    const { email, forgotPassword } = command;
    try {
      const user = await this.userRepo.findFirst({ email });
      if (!user) throw new BadRequestException('User not found!');

      const forgotPassReq = await this.fusionAuthService.forgotPasswordRequest(
        email,
      );

      this.emailService.sendMail({
        mailType: 'template',
        to: email,
        from: 'hello@hcharity.org',
        subject: 'استعادة كلمة المرور',
        templateContext: {
          name: user.employee_name,
          resetUrl: forgotPassword
            ? `${this.configService.get<string>(
                'tenderAppConfig.baseUrl',
              )}/auth/forgot-password/${forgotPassReq}`
            : `${this.configService.get<string>(
                'tenderAppConfig.baseUrl',
              )}/auth/reset-password/${forgotPassReq}`,
        },
        templatePath: `tender/ar/account/forget_password`,
      });

      return {
        data: forgotPassReq,
      };
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
