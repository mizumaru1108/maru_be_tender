import { User } from '@fusionauth/typescript-client';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterOrganizationDto,
} from '../dtos';
import { HandleGoogleCallbackDto } from '../dtos/requests/handle-google-callback.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login with fusion auth' })
  @ApiResponse({
    status: 201,
    description: 'Login Success!',
  })
  @Post('google/login')
  async googleLogin(): Promise<BaseResponse<string>> {
    const loginResponse = await this.authService.googleLogin();
    return baseResponseHelper(
      loginResponse,
      HttpStatus.CREATED,
      'Login Success!',
    );
  }

  @ApiOperation({ summary: 'Login with fusion auth' })
  @ApiResponse({
    status: 201,
    description: 'Login Success!',
  })
  @Post('google/auth-callback')
  async handleGoogleCallback(@Body() { code }: HandleGoogleCallbackDto) {
    console.log('code', code);
    const loginResponse = await this.authService.handleGoogleCallback(code);
    return baseResponseHelper(
      loginResponse,
      HttpStatus.CREATED,
      'Login Success!',
    );
  }

  @ApiOperation({ summary: 'Login with fusion auth' })
  @ApiResponse({
    status: 201,
    description: 'Login Success!',
  })
  @Post('fusion/login')
  async fusionLogin(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<BaseResponse<LoginResponseDto>> {
    const loginResponse = await this.authService.fusionLogin(loginRequest);
    return baseResponseHelper(
      loginResponse,
      HttpStatus.CREATED,
      'Login Success!',
    );
  }

  @ApiOperation({ summary: 'Register user with fusion auth' })
  @ApiResponse({
    status: 201,
    description: 'User has been registered successfully!',
  })
  @Post('fusion/register')
  async fusionRegister(
    @Body() registerRequest: RegisterRequestDto,
  ): Promise<BaseResponse<User>> {
    const registeredUser = await this.authService.fusionRegister(
      registerRequest,
    );
    return baseResponseHelper(
      registeredUser,
      HttpStatus.CREATED,
      'Login Success!',
    );
  }

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.registerUser(name, email, password);
  }

  /**
   * * Register organization
   */

  @Post('register-organization')
  async registerOrganization(@Body() registerRequest: RegisterOrganizationDto) {
    // Promise<BaseResponse<User>>
    const registeredUserOrganization =
      await this.authService.registerUserOrganization(registerRequest);

    return baseResponseHelper<any>(
      registeredUserOrganization,
      HttpStatus.OK,
      'Register Success Success!',
    );
  }
}
