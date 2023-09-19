import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
export class AskForgotPasswordUrlCommand {
  email: string;
}

export class AskForgotPasswordUrlCommandResult {
  data: string;
}

@CommandHandler(AskForgotPasswordUrlCommand)
export class AskForgotPasswordUrlCommandHandler
  implements
    ICommandHandler<
      AskForgotPasswordUrlCommand,
      AskForgotPasswordUrlCommandResult
    >
{
  constructor(
    private readonly userRepo: TenderUserRepository,
    private readonly fusionAuthService: FusionAuthService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    command: AskForgotPasswordUrlCommand,
  ): Promise<AskForgotPasswordUrlCommandResult> {
    const { email } = command;
    try {
      const user = await this.userRepo.findFirst({ email });
      if (!user) throw new BadRequestException('User not found!');

      const response = await this.fusionAuthService.forgotPasswordRequest(
        email,
      );

      const url = `${this.configService.get<string>(
        'tenderAppConfig.baseUrl',
      )}/auth/forgot-password/${response}`;

      return {
        data: url,
      };
    } catch (error) {
      throw error;
    }
  }
}
