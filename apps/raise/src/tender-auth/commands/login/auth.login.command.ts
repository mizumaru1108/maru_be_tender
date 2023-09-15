import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginRequestDto } from '../../../auth/dtos';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { TenderLoginResponseDto } from '../../dtos/responses/tender-login-response.dto';
import { UserStatusEnum } from '../../../tender-user/user/types/user_status';
import { logUtil } from '../../../commons/utils/log-util';

export class AuthLoginCommand {
  dto: LoginRequestDto;
}

export class AuthLoginCommandResult {
  data: TenderLoginResponseDto;
}

@CommandHandler(AuthLoginCommand)
export class AuthLoginCommandHandler
  implements ICommandHandler<AuthLoginCommand, AuthLoginCommandResult>
{
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': AuthLoginCommandHandler.name,
  });

  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly tenderUserRepo: TenderUserRepository,
  ) {}

  async execute(command: AuthLoginCommand): Promise<AuthLoginCommandResult> {
    const { loginId, password } = command.dto;
    try {
      // console.log({ loginId });
      let license_number = '';
      let phone_number = '';
      let email = '';

      if (/^(\+966|966)/.test(loginId)) {
        phone_number = loginId;
      } else if (/^\d+$/.test(loginId) && !/^(?:\+966|966)/.test(loginId)) {
        license_number = loginId;
      } else if (/^\S+@\S+\.\S+$/.test(loginId)) {
        email = loginId;
      }

      // console.log({ license_number });
      // console.log({ phone_number });
      // console.log({ email });

      const users = await this.tenderUserRepo.checkExistance(
        phone_number,
        email,
        license_number,
      );
      // console.log({ users });

      if (users.length === 0) {
        throw new UnauthorizedException('Wrong Credentials!');
      }
      if (users.length > 1) {
        console.log('duplicate user', logUtil(users));
        throw new UnauthorizedException('Wrong Credentials!');
      }

      const user = users[0];
      if (
        user.status_id === UserStatusEnum.DELETED ||
        user.status_id === UserStatusEnum.CANCELED_ACCOUNT
      ) {
        throw new UnauthorizedException('Wrong Credentials!');
      }

      // if user found then do regular login using fusion auth
      const fusionAuthResponse = await this.fusionAuthService.fusionAuthLogin({
        loginId: user.email,
        password,
      });

      if (
        !fusionAuthResponse.response.user ||
        !fusionAuthResponse.response.user.id
      ) {
        throw new BadRequestException(
          'Failed to get the user after fusion auth login!',
        );
      }

      return {
        data: {
          fusionAuthResponse,
          userData: user,
          clientData: user.client_data,
        },
      };
    } catch (error) {
      this.logger.error('login error', error);
      throw error;
    }
  }
}
