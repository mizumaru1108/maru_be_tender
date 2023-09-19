import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import {
  SearchUserFilterRequest,
  TenderCreateUserDto,
  TenderDeleteUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  UserStatusUpdateDto,
} from '../dtos/requests';
import { FindUserResponse } from '../dtos/responses/find-user-response.dto';

import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from '../../../commons/decorators/base.api.ok.response.decorator';
import { DataNotFoundException } from '../../../tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from '../../../tender-commons/exceptions/forbidden-permission-exception';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { BasePrismaErrorException } from '../../../tender-commons/exceptions/prisma-error/base.prisma.error.exception';
import { RequestErrorException } from '../../../tender-commons/exceptions/request-error.exception';
import {
  UserCreateCommand,
  UserCreateCommandResult,
} from '../commands/user.create/user.create.command';
import {
  UserSoftDeleteCommand,
  UserSoftDeleteCommandResult,
} from '../commands/user.soft.delete/user.soft.delete.command';
import {
  UserUpdateProfileCommand,
  UserUpdateProfileCommandResult,
} from '../commands/user.update.profile/user.update.profile.command';
import {
  UserUpdateStatusCommand,
  UserUpdateStatusCommandResult,
} from '../commands/user.update.status/user.update.status.command';
import {
  UserUpdateCommand,
  UserUpdateCommandResult,
} from '../commands/user.update/user.update.command';
import { TenderCurrentUser } from '../interfaces/current-user.interface';
import { TenderUserService } from '../services/tender-user.service';
@ApiTags('UserModule')
@Controller('tender-user')
export class TenderUserController {
  constructor(
    private readonly tenderUserService: TenderUserService,
    private readonly commandBus: CommandBus,
  ) {}

  errorMapper(error: any) {
    if (error instanceof DataNotFoundException) {
      return new NotFoundException(error.message);
    }
    if (error instanceof PayloadErrorException) {
      return new BadRequestException(error.message);
    }
    if (error instanceof ForbiddenPermissionException) {
      return new ForbiddenException(error.message);
    }
    if (error instanceof RequestErrorException) {
      return new UnprocessableEntityException(error.message);
    }
    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    }
    if (error instanceof ConflictException) {
      throw new ConflictException(error.message);
    }
    if (error instanceof UnauthorizedException) {
      throw new UnauthorizedException(error.message);
    }

    if (error instanceof BasePrismaErrorException) {
      return new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error.message,
          error: error.stack ? JSON.parse(error.stack) : error.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return new InternalServerErrorException(error);
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async createUser(@Body() dto: TenderCreateUserDto) {
    try {
      const command = Builder<UserCreateCommand>(UserCreateCommand, {
        dto,
      }).build();

      const { data } = await this.commandBus.execute<
        UserCreateCommand,
        UserCreateCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.CREATED,
        'User Created Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_client',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
    'tender_consultant',
  )
  @Get('find-users')
  async findUsers(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: SearchUserFilterRequest,
  ): Promise<ManualPaginatedResponse<FindUserResponse['data']>> {
    const response = await this.tenderUserService.findUsers(
      currentUser,
      filter,
    );

    return manualPaginationHelper(
      response.data,
      response.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('soft-delete')
  async softDelete(
    @Body() dto: TenderDeleteUserDto,
  ): Promise<BaseResponse<any>> {
    try {
      const command = Builder<UserSoftDeleteCommand>(UserSoftDeleteCommand, {
        user_id: dto.user_id,
      }).build();

      const result = await this.commandBus.execute<
        UserSoftDeleteCommand,
        UserSoftDeleteCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'User Deleted Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @UseGuards(TenderJwtGuard)
  @Patch('update-profile')
  async updateProfile(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: UpdateProfileDto,
  ): Promise<BaseResponse<any>> {
    try {
      const command = Builder<UserUpdateProfileCommand>(
        UserUpdateProfileCommand,
        {
          currentUser,
          request,
        },
      ).build();

      const { data } = await this.commandBus.execute<
        UserUpdateProfileCommand,
        UserUpdateProfileCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.OK,
        'User updated successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'Updating user status (admin only)',
  })
  @BaseApiOkResponse(UserUpdateStatusCommandResult, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Patch('update-status')
  async updateStatus(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: UserStatusUpdateDto,
  ): Promise<BaseResponse<any>> {
    try {
      const command = Builder<UserUpdateStatusCommand>(
        UserUpdateStatusCommand,
        {
          acc_manager_id: currentUser.id,
          request: dto,
        },
      ).build();

      const result = await this.commandBus.execute<
        UserUpdateStatusCommand,
        UserUpdateStatusCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'User updated successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'Updating user [for updating employee only] (admin only)',
  })
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update-user')
  async updateUser(@Body() request: UpdateUserDto): Promise<BaseResponse<any>> {
    try {
      const command = Builder<UserUpdateCommand>(UserUpdateCommand, {
        dto: request,
      }).build();

      const result = await this.commandBus.execute<
        UserUpdateCommand,
        UserUpdateCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'User updated successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
