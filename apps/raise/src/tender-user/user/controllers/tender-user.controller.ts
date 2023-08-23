import {
  BadRequestException,
  Body,
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
import { CreateUserResponseDto } from '../dtos/responses/create-user-response.dto';
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
  UserUpdateStatusCommand,
  UserUpdateStatusCommandResult,
} from '../commands/user.update.status/user.update.status.command';
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
  async createUser(
    @Body() request: TenderCreateUserDto,
  ): Promise<BaseResponse<CreateUserResponseDto>> {
    const response = await this.tenderUserService.createUser(request);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'User created successfully!',
    );
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
  @Post('delete')
  async deleteUser(
    @Body() request: TenderDeleteUserDto,
  ): Promise<BaseResponse<any>> {
    const { user_id } = request;
    const response = await this.tenderUserService.deleteUserWFusionAuth(
      user_id,
    );
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'User deleted successfully!',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Patch('update-profile')
  async updateProfile(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: UpdateProfileDto,
  ): Promise<BaseResponse<any>> {
    const updateResult = await this.tenderUserService.updateProfile(
      currentUser,
      request,
    );
    return baseResponseHelper(
      updateResult,
      HttpStatus.CREATED,
      'User updated successfully!',
    );
  }

  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles('tender_accounts_manager')
  // @Patch('update-status')
  // async updateStatus(
  //   @CurrentUser() currentUser: TenderCurrentUser,
  //   @Body() request: UserStatusUpdateDto,
  // ): Promise<BaseResponse<any>> {
  //   const status = await this.tenderUserService.updateUserStatus(
  //     currentUser.id,
  //     request,
  //   );
  //   return baseResponseHelper(
  //     status,
  //     HttpStatus.CREATED,
  //     'User updated successfully!',
  //   );
  // }
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

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update-user')
  async updateUser(@Body() request: UpdateUserDto): Promise<BaseResponse<any>> {
    const status = await this.tenderUserService.updateUserData(request);
    return baseResponseHelper(
      status,
      HttpStatus.CREATED,
      'User updated successfully!',
    );
  }
}
