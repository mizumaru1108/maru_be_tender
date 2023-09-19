import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { LoginRequestDto } from '../../auth/dtos';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { FileUploadErrorException } from '../../libs/bunny/exception/file-upload-error.exception';
import { FusionAuthPasswordlessLoginErrorException } from '../../libs/fusionauth/exceptions/fusion.auth.passwordless.login.error.exception';
import { FusionAuthPasswordlessStartError } from '../../libs/fusionauth/exceptions/fusion.auth.passwordless.start.error.exception';
import { FusionAuthRegisterError } from '../../libs/fusionauth/exceptions/fusion.auth.register.error.exception';
import { FusionAuthVerifyEmailErrorException } from '../../libs/fusionauth/exceptions/fusion.auth.verify.email.error.exception';
import { DataNotFoundException } from '../../tender-commons/exceptions/data-not-found.exception';
import { InvalidFileExtensionException } from '../../tender-commons/exceptions/invalid-file-extension.exception';
import { InvalidFileSizeException } from '../../tender-commons/exceptions/invalid-file-size.exception';
import { PayloadErrorException } from '../../tender-commons/exceptions/payload-error.exception';
import { PrismaTransactionExpiredException } from '../../tender-commons/exceptions/prisma-error/prisma-transaction-expired.exception';
import { CreateUserResponseDto } from '../../tender-user/user/dtos/responses/create-user-response.dto';
import { EmailAlreadyVerifiedException } from '../../tender-user/user/exceptions/email-already-verified.exception';
import { UserAlreadyExistException } from '../../tender-user/user/exceptions/user-already-exist-exception.exception';
import {
  AskForgotPasswordUrlCommand,
  AskForgotPasswordUrlCommandResult,
} from '../commands/ask-forgot-password-url/ask.forgot.password.url.command';
import { AuthLoginCommand } from '../commands/login/auth.login.command';
import { RegisterClientCommand } from '../commands/register/register.command';
import {
  ResetPasswordRequestCommand,
  ResetPasswordRequestCommandResult,
} from '../commands/reset-password-request/reset.password.request.command';
import { SendEmailVerificationClassCommand } from '../commands/send.email.verification/send.email.verification.command';
import {
  SubmitChangePasswordCommand,
  SubmitChangePasswordCommandResult,
} from '../commands/submit-change-password/submit.change.password.command';
import { VerifyEmailCommand } from '../commands/verify.email/verify.email.command';
import { TenderRoles } from '../decorators/tender-roles.decorator';
import { ForgotPasswordRequestDto } from '../dtos/requests/forgot-password-request.dto';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { SendEmailVerifDto } from '../dtos/requests/send-email-verif.dto';
import { SubmitChangePasswordDto } from '../dtos/requests/submit-change-password.dto';
import { TenderLoginResponseDto } from '../dtos/responses/tender-login-response.dto';
import { TokenExpiredException } from '../exceptions/token-expire.exception';
import { TenderJwtGuard } from '../guards/tender-jwt.guard';
import { TenderRolesGuard } from '../guards/tender-roles.guard';
@ApiTags('AuthModule')
@Controller('tender-auth')
export class TenderAuthController {
  constructor(private readonly commandBus: CommandBus) {}

  errorMapper(error: any) {
    if (
      error instanceof UserAlreadyExistException ||
      error instanceof EmailAlreadyVerifiedException
    ) {
      return new ConflictException(error.message);
    }
    if (error instanceof UnauthorizedException) {
      return new UnauthorizedException(error.message);
    }
    if (
      error instanceof FusionAuthRegisterError ||
      error instanceof PayloadErrorException ||
      error instanceof InvalidFileExtensionException ||
      error instanceof InvalidFileSizeException
    ) {
      return new BadRequestException(error.message);
    }
    if (
      error instanceof FileUploadErrorException ||
      error instanceof PrismaTransactionExpiredException ||
      error instanceof FusionAuthPasswordlessStartError ||
      error instanceof FusionAuthPasswordlessLoginErrorException ||
      error instanceof FusionAuthVerifyEmailErrorException ||
      error instanceof TokenExpiredException
    ) {
      return new UnprocessableEntityException(error.message);
    }
    if (error instanceof DataNotFoundException) {
      return new NotFoundException(error.message);
    }
    return new InternalServerErrorException(error);
  }

  @Post('login')
  async login(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<BaseResponse<TenderLoginResponseDto>> {
    try {
      const authLoginCommand = Builder<AuthLoginCommand>(AuthLoginCommand, {
        dto: loginRequest,
      }).build();

      const { data } = await this.commandBus.execute(authLoginCommand);

      return baseResponseHelper(
        data,
        HttpStatus.CREATED,
        'Client has been logged in successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
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
      throw this.errorMapper(error);
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
      throw this.errorMapper(error);
    }
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
      throw this.errorMapper(error);
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Post('reset-password-request')
  async resetPasswordRequest(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<BaseResponse<string>> {
    try {
      const command = Builder<ResetPasswordRequestCommand>(
        ResetPasswordRequestCommand,
        {
          email: request.email,
          forgotPassword: false,
          selected_language: request.selectLang,
        },
      ).build();

      const { data } = await this.commandBus.execute<
        ResetPasswordRequestCommand,
        ResetPasswordRequestCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.CREATED,
        'Reset password already submitted!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Post('ask-forgot-password-url')
  async askForgotPasswordUrl(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<BaseResponse<string>> {
    try {
      const command = Builder<AskForgotPasswordUrlCommand>(
        AskForgotPasswordUrlCommand,
        {
          email: request.email,
        },
      ).build();

      const { data } = await this.commandBus.execute<
        AskForgotPasswordUrlCommand,
        AskForgotPasswordUrlCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.CREATED,
        'Forgot password url already asked!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @Post('forgot-password-request')
  async forgotPasswordRequest(
    @Body() request: ForgotPasswordRequestDto,
  ): Promise<BaseResponse<string>> {
    try {
      const command = Builder<ResetPasswordRequestCommand>(
        ResetPasswordRequestCommand,
        {
          email: request.email,
          forgotPassword: true,
          selected_language: request.selectLang,
        },
      ).build();

      const { data } = await this.commandBus.execute<
        ResetPasswordRequestCommand,
        ResetPasswordRequestCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.CREATED,
        'Forgot password already submitted!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @Post('submit-change-password')
  async submitForgotPassword(
    @Body() request: SubmitChangePasswordDto,
  ): Promise<BaseResponse<string>> {
    try {
      const command = Builder<SubmitChangePasswordCommand>(
        SubmitChangePasswordCommand,
        { request },
      ).build();

      const { data } = await this.commandBus.execute<
        SubmitChangePasswordCommand,
        SubmitChangePasswordCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.CREATED,
        'Client password successfully changed!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
