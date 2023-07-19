import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { LoginRequestDto } from '../../auth/dtos';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { FileUploadErrorException } from '../../libs/bunny/exception/file-upload-error.exception';
import { FusionAuthPasswordlessStartError } from '../../libs/fusionauth/exceptions/fusion.auth.passwordless.start.error.exception';
import { FusionAuthRegisterError } from '../../libs/fusionauth/exceptions/fusion.auth.register.error.exception';
import { InvalidFileExtensionException } from '../../tender-commons/exceptions/invalid-file-extension.exception';
import { InvalidFileSizeException } from '../../tender-commons/exceptions/invalid-file-size.exception';
import { PayloadErrorException } from '../../tender-commons/exceptions/payload-error.exception';
import { PrismaTransactionExpiredException } from '../../tender-commons/exceptions/prisma-error/prisma-transaction-expired.exception';
import { CreateUserResponseDto } from '../../tender-user/user/dtos/responses/create-user-response.dto';
import { UserAlreadyExistException } from '../../tender-user/user/exceptions/user-already-exist-exception.exception';
import { RegisterClientCommand } from '../commands/register/register.command';
import { SendEmailVerificationClassCommand } from '../commands/send.email.verification/send.email.verification.command';
import { TenderRoles } from '../decorators/tender-roles.decorator';
import { ForgotPasswordRequestDto } from '../dtos/requests/forgot-password-request.dto';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { SendEmailVerifDto } from '../dtos/requests/send-email-verif.dto';
import { SubmitChangePasswordDto } from '../dtos/requests/submit-change-password.dto';
import { TenderLoginResponseDto } from '../dtos/responses/tender-login-response.dto';
import { TenderJwtGuard } from '../guards/tender-jwt.guard';
import { TenderRolesGuard } from '../guards/tender-roles.guard';
import { TenderAuthService } from '../services/tender-auth.service';
import { VerifyEmailCommand } from '../commands/verify.email/verify.email.command';
import { TokenExpiredException } from '../exceptions/token-expire.exception';
import { EmailAlreadyVerifiedException } from '../../tender-user/user/exceptions/email-already-verified.exception';
import { FusionAuthPasswordlessLoginErrorException } from '../../libs/fusionauth/exceptions/fusion.auth.passwordless.login.error.exception';
import { DataNotFoundException } from '../../tender-commons/exceptions/data-not-found.exception';
import { FusionAuthVerifyEmailErrorException } from '../../libs/fusionauth/exceptions/fusion.auth.verify.email.error.exception';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('AuthModule')
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
    try {
      const sendEmailVerifCommand = Builder<SendEmailVerificationClassCommand>(
        SendEmailVerificationClassCommand,
        {
          email: request.email,
          selectLang: request.selectLang,
        },
      ).build();

      const result = await this.commandBus.execute(sendEmailVerifCommand);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Send email verif success!',
      );
    } catch (error) {
      if (error instanceof FusionAuthPasswordlessStartError) {
        throw new UnprocessableEntityException(error.message);
      }
      throw error;
    }
  }

  @Post('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    try {
      const verifyEmailCommand = Builder<VerifyEmailCommand>(
        VerifyEmailCommand,
        {
          token: token,
          selectLang: 'ar',
        },
      ).build();

      const result = await this.commandBus.execute(verifyEmailCommand);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Verify email success!',
      );
    } catch (error) {
      if (
        error instanceof FusionAuthPasswordlessLoginErrorException ||
        error instanceof FusionAuthVerifyEmailErrorException
      ) {
        throw new UnprocessableEntityException(error.message);
      }
      if (error instanceof TokenExpiredException) {
        throw new UnprocessableEntityException(error.message);
      }
      if (error instanceof EmailAlreadyVerifiedException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof DataNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // DEPRECATED
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
        throw new UnprocessableEntityException(error.message);
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
