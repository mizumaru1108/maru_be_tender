import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubmitChangePasswordDto } from '../../dtos/requests/submit-change-password.dto';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
export class SubmitChangePasswordCommand {
  request: SubmitChangePasswordDto;
}

export class SubmitChangePasswordCommandResult {
  data: string;
}

@CommandHandler(SubmitChangePasswordCommand)
export class SubmitChangePasswordCommandHandler
  implements
    ICommandHandler<
      SubmitChangePasswordCommand,
      SubmitChangePasswordCommandResult
    >
{
  constructor(private readonly fusionAuthService: FusionAuthService) {}

  async execute(
    command: SubmitChangePasswordCommand,
  ): Promise<SubmitChangePasswordCommandResult> {
    const { request } = command;
    try {
      await this.fusionAuthService.submitChangePassword(
        request.changePasswordId,
        request.newPassword,
        request.oldPassword,
      );
      return {
        data: 'Password Changed Successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}
