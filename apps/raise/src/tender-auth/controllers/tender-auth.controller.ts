import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { user } from '@prisma/client';
import { LoginRequestDto } from '../../auth/dtos';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { CreateUserResponseDto } from '../../tender-user/user/dtos/responses/create-user-response.dto';
import { TenderRoles } from '../decorators/tender-roles.decorator';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { ForgotPasswordRequestDto } from '../dtos/requests/forgot-password-request.dto';
import { TenderLoginResponseDto } from '../dtos/responses/tender-login-response.dto';
import { TenderJwtGuard } from '../guards/tender-jwt.guard';
import { TenderRolesGuard } from '../guards/tender-roles.guard';
import { TenderAuthService } from '../services/tender-auth.service';
import { SubmitChangePasswordDto } from '../dtos/requests/submit-change-password.dto';

@Controller('tender-auth')
export class TenderAuthController {
  constructor(private readonly tenderAuthService: TenderAuthService) {}

  @Post('login')
  async login(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<BaseResponse<TenderLoginResponseDto>> {
    const createdClient = await this.tenderAuthService.login(loginRequest);
    return baseResponseHelper(
      createdClient,
      HttpStatus.CREATED,
      'Client has been logged in successfully!',
    );
  }

  @Post('register')
  async register(
    @Body() registerRequest: RegisterTenderDto,
  ): Promise<BaseResponse<CreateUserResponseDto>> {
    const createdClient = await this.tenderAuthService.register(
      registerRequest,
    );
    return baseResponseHelper(
      createdClient,
      HttpStatus.CREATED,
      'Client has been registered successfully!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Post('forgot-password-request')
  async forgotPasswordRequest(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<BaseResponse<any>> {
    const createdClient = await this.tenderAuthService.forgotPasswordRequest(
      request.email,
    );
    return baseResponseHelper(
      createdClient,
      HttpStatus.CREATED,
      'Forgot password already submitted!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('submit-change-password')
  async submitForgotPassword(
    @Body() request: SubmitChangePasswordDto,
  ): Promise<BaseResponse<string>> {
    await this.tenderAuthService.submitChangePassword(request);
    return baseResponseHelper(
      'Password Changed Successfully!',
      HttpStatus.CREATED,
      'Client password successfully changed!',
    );
  }
}
