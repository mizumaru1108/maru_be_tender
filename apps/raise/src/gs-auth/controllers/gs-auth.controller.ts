import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto, RegisterRequestDto } from '../../auth/dtos';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import {
  GSRegisterRequestDto,
  GSVerifyUser,
  GSResetPassword,
} from '../dtos/requests/gs-register-request.dto';
import { GsAuthService } from '../services/gs-auth.service';
import { BaseResponse } from '../../commons/dtos/base-response';
import { User } from '../../user/schema/user.schema';
import { SubmitChangePasswordDto } from 'src/tender-auth/dtos/requests/submit-change-password.dto';

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

  @Post('resetPassword')
  async resetPassword(@Body() resetRequest: GSResetPassword) {
    const resetPwdResponse = await this.gsAuthService.resetPasswordUser(
      resetRequest,
    );

    return baseResponseHelper<any>(
      resetPwdResponse,
      HttpStatus.OK,
      'Reset password success send link email!',
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

  @Post('submit-change-password')
  async submitForgotPassword(
    @Body() request: SubmitChangePasswordDto,
  ): Promise<BaseResponse<string>> {
    await this.gsAuthService.submitChangePassword(request);

    return baseResponseHelper(
      'Password Changed Successfully!',
      HttpStatus.OK,
      'Password Changed Successfully!',
    );
  }
}
