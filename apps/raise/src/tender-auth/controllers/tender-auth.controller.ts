import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { user } from '@prisma/client';
import { LoginRequestDto } from '../../auth/dtos';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { CreateUserResponseDto } from '../../tender-user/user/dtos/responses/create-user-response.dto';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { TenderLoginResponseDto } from '../dtos/responses/tender-login-response.dto';
import { TenderAuthService } from '../services/tender-auth.service';

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
}
