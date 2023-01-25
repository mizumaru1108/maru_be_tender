import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { user } from '@prisma/client';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCreateUserDto } from '../dtos/requests/create-user.dto';

import { TenderDeleteUserDto } from '../dtos/requests/delete-user.dto';
import { SearchUserFilterRequest } from '../dtos/requests/search-user-filter-request.dto';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UserStatusUpdateDto } from '../dtos/requests/user-status-update.dto';
import { CreateUserResponseDto } from '../dtos/responses/create-user-response.dto';
import { FindUserResponse } from '../dtos/responses/find-user-response.dto';
import { TenderCurrentUser } from '../interfaces/current-user.interface';
import { TenderUserService } from '../services/tender-user.service';

@Controller('tender-user')
export class TenderUserController {
  constructor(private readonly tenderUserService: TenderUserService) {}

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

  @UseGuards(TenderJwtGuard)
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
    @Body() request: UpdateUserDto,
  ): Promise<BaseResponse<any>> {
    // console.log('request', request);
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

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Patch('update-status')
  async updateStatus(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: UserStatusUpdateDto,
  ): Promise<BaseResponse<any>> {
    const status = await this.tenderUserService.updateUserStatus(
      currentUser.id,
      request,
    );
    return baseResponseHelper(
      status,
      HttpStatus.CREATED,
      'User updated successfully!',
    );
  }
}
