import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { User } from '../user/schema/user.schema';

import { AuthService } from './auth.service';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterTendersDto,
  RegReqTenderDto,
} from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @ApiOperation({ summary: 'Register user with fusion auth' })
  @ApiResponse({
    status: 201,
    description: 'User has been registered successfully!',
  })
  @Post('fusion/regTender')
  async fusionRegisterTender(@Body() registerRequest: RegisterTendersDto) {
    const registeredUser = await this.authService.fusionRegisterTender(
      registerRequest,
    );
    return baseResponseHelper(
      registeredUser,
      HttpStatus.CREATED,
      'Create User Success!',
    );
  }
}
