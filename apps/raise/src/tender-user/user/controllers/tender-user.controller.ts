import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { user } from '@prisma/client';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { TenderCreateUserDto } from '../dtos/requests/create-user.dto';

import { TenderDeleteUserDto } from '../dtos/requests/delete-user.dto';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { CreateUserResponseDto } from '../dtos/responses/create-user-response.dto';
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

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_admin',
    'tender_ceo',
    'tender_consultant',
    'tender_accounts_manager',
    'tender_project_supervisor',
    'tender_project_manager',
    'tender_moderator',
    'tender_finance',
    'tender_cashier',
  )
  @Patch('update-profile')
  async updateProfile(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: UpdateUserDto,
  ): Promise<BaseResponse<any>> {
    const updateResult = await this.tenderUserService.updateProfile(
      currentUser.id,
      request,
    );
    return baseResponseHelper(
      updateResult,
      HttpStatus.CREATED,
      'User updated successfully!',
    );
  }
}
