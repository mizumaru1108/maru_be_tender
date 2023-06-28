import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  RequestTimeoutException,
  UseGuards,
} from '@nestjs/common';
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
import { SendEmailVerifDto } from '../dtos/requests/send-email-verif.dto';
import { Builder } from 'builder-pattern';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterClientCommand } from '../commands/register/register.command';
import { PayloadErrorException } from '../../tender-commons/exceptions/payload-error.exception';
import { UserAlreadyExistException } from '../../tender-user/user/exceptions/user-already-exist-exception.exception';
import { FusionAuthRegisterError } from '../../libs/fusionauth/exceptions/fusion.auth.register.error.exception';
import { InvalidFileExtensionException } from '../../tender-commons/exceptions/invalid-file-extension.exception';
import { InvalidFileSizeException } from '../../tender-commons/exceptions/invalid-file-size.exception';
import { FileUploadErrorException } from '../../libs/bunny/exception/file-upload-error.exception';
import { PrismaTransactionExpiredException } from '../../tender-commons/exceptions/prisma-transaction-expired.exception';

@Controller('tender-auth')
export class TenderAuthController {
  constructor(
    private readonly tenderAuthService: TenderAuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('old/login')
  async oldLogin(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<BaseResponse<TenderLoginResponseDto>> {
    const createdClient = await this.tenderAuthService.login(loginRequest);
    return baseResponseHelper(
      createdClient,
      HttpStatus.CREATED,
      'Client has been logged in successfully!',
    );
  }

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

  @Post('send-email-verif')
  async sendEmailVerif(@Body() request: SendEmailVerifDto) {
    const res = await this.tenderAuthService.sendEmailVerif(
      request.email,
      request.selectLang || 'ar',
    );
    return baseResponseHelper(
      res,
      HttpStatus.CREATED,
      'Send email verif success!',
    );
  }

  @Post('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    const res = await this.tenderAuthService.verifyEmail(token);
    return baseResponseHelper(res, HttpStatus.CREATED, 'Verify email success!');
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

  @Post('register-client')
  async registerClient(
    @Body() registerRequest: RegisterTenderDto,
  ): Promise<BaseResponse<CreateUserResponseDto>> {
    try {
      const registerCommand = Builder<RegisterClientCommand>(
        RegisterClientCommand,
        {
          request: registerRequest,
        },
      ).build();

      const result = await this.commandBus.execute(registerCommand);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Client has been registered successfully!',
      );
    } catch (error) {
      if (error instanceof UserAlreadyExistException) {
        throw new ConflictException(error.message);
      }
      if (
        error instanceof FusionAuthRegisterError ||
        error instanceof PayloadErrorException ||
        error instanceof InvalidFileExtensionException ||
        error instanceof InvalidFileSizeException
      ) {
        throw new BadRequestException(error.message);
      }
      if (
        error instanceof FileUploadErrorException ||
        error instanceof PrismaTransactionExpiredException
      ) {
        throw new RequestTimeoutException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Post('reset-password-request')
  async resetPasswordRequest(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<BaseResponse<any>> {
    const createdClient = await this.tenderAuthService.changePasswordRequest(
      request.email,
      false,
      request.selectLang,
    );
    return baseResponseHelper(
      createdClient,
      HttpStatus.CREATED,
      'Forgot password already submitted!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Post('ask-forgot-password-url')
  async askForgotPasswordUrl(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<BaseResponse<string>> {
    const url = await this.tenderAuthService.askForgotPasswordUrl(
      request.email,
    );
    return baseResponseHelper(
      url,
      HttpStatus.CREATED,
      'Forgot password url already asked!',
    );
  }

  @Post('forgot-password-request')
  async forgotPasswordRequest(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<BaseResponse<any>> {
    const createdClient = await this.tenderAuthService.changePasswordRequest(
      request.email,
      true,
      request.selectLang,
    );
    return baseResponseHelper(
      createdClient,
      HttpStatus.CREATED,
      'Forgot password already submitted!',
    );
  }

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
