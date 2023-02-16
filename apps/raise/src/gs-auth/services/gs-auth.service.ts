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

  async register(registerRequest: GSRegisterRequestDto) {
    const fusionAuthRes = await this.fusionAuthService.fusionAuthRegister(
      registerRequest,
    );

    if (!fusionAuthRes || !fusionAuthRes.user || !fusionAuthRes.user.id) {
      throw new BadRequestException('Failed to fetch user!');
    }

    const registeredUser = await this.gsUserService.registerFromFusion({
      _id: fusionAuthRes.user.id,
      firstname: fusionAuthRes.user.firstName,
      lastname: fusionAuthRes.user.lastName,
      email: fusionAuthRes.user.email,
      country: registerRequest.country,
      state: registerRequest.state,
      address: registerRequest.address,
      mobile: registerRequest.mobile,
      organizationId: registerRequest.organizationId,
    });

    const verifyEmail = await this.fusionAuthService.fusionEmailVerification({
      email: fusionAuthRes.user.email,
      userId: fusionAuthRes.user.id,
      organizationId: registerRequest.organizationId,
      organizationEmail: registerRequest.organizationEmail,
      domainUrl: registerRequest.domainUrl,
    });

    return {
      user: registeredUser,
      verificationId: verifyEmail.verificationId,
      url: registerRequest.domainUrl,
      token: fusionAuthRes.token,
      refreshToken: fusionAuthRes.refreshToken,
    };
  }
}
