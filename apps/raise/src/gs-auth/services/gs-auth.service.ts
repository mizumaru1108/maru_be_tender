import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginRequestDto, RegisterRequestDto } from '../../auth/dtos';
import { GsUserService } from '../../gs-user/services/gs-user.service';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { GSRegisterRequestDto } from '../dtos/requests/gs-register-request.dto';

@Injectable()
export class GsAuthService {
  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly gsUserService: GsUserService,
  ) {}

  async login(loginRequest: LoginRequestDto) {
    const fusionRes = await this.fusionAuthService.fusionAuthLogin(
      loginRequest,
    );
    if (!fusionRes || !fusionRes.response.user || !fusionRes.response.user.id) {
      throw new BadRequestException('Failed to fetch user!');
    }
    const user = await this.gsUserService.findUserById(
      fusionRes.response.user.id,
    );
    return {
      fusionAuthRes: fusionRes,
      user: user,
    };
  }

  async register(loginRequest: GSRegisterRequestDto) {
    console.log('masuk');
    const fusionRes = await this.fusionAuthService.fusionAuthRegister(
      loginRequest,
    );

    // const duplicatedUser = await this.gsUserService.findOne({

    // })
  }
}
