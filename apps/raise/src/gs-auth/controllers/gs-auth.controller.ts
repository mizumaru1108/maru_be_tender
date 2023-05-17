import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto, RegisterRequestDto } from '../../auth/dtos';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import {
  GSRegisterRequestDto,
  GSVerifyUser,
} from '../dtos/requests/gs-register-request.dto';
import { GsAuthService } from '../services/gs-auth.service';
import { BaseResponse } from '../../commons/dtos/base-response';
import { User } from '../../user/schema/user.schema';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';

@Controller('gs/auth')
export class GsAuthController {
  constructor(private readonly gsAuthService: GsAuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequestDto) {
    const submitLogin = await this.gsAuthService.login(loginRequest);
    return baseResponseHelper<any>(
      submitLogin,
      HttpStatus.CREATED,
      'Login Success!',
    );
  }

  @Post('register')
  async register(
    @Body() registerRequest: GSRegisterRequestDto,
  ): Promise<BaseResponse<User>> {
    const registeredUser = await this.gsAuthService.register(registerRequest);

    return baseResponseHelper<any>(
      registeredUser,
      HttpStatus.CREATED,
      'Register Success Success!',
    );
  }

  @Post('verifyUser')
  async verifyUserCheck(@Body() verifyPayload: GSVerifyUser) {
    const submitVerify = await this.gsAuthService.verifyUser(verifyPayload);

    return baseResponseHelper<any>(
      submitVerify,
      HttpStatus.OK,
      'Verify user successfully!',
    );
  }
}
