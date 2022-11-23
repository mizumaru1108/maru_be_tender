import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { user } from '@prisma/client';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { TenderCreateUserDto } from '../dtos/requests/create-user.dto';

import { TenderDeleteUserDto } from '../dtos/requests/delete-user.dto';
import { TenderUserService } from '../services/tender-user.service';

@Controller('tender-user')
export class TenderUserController {
  constructor(private readonly tenderUserService: TenderUserService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async createUser(
    @Body() request: TenderCreateUserDto,
  ): Promise<BaseResponse<user>> {
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
  ): Promise<BaseResponse<user>> {
    const { user_id } = request;
    const response = await this.tenderUserService.deleteUser(user_id);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'User deleted successfully!',
    );
  }
}
