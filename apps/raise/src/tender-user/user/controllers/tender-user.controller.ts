import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { user } from '@prisma/client';
import { ClusterRoles } from '../../../auth/cluster-roles.decorator';
import { ClusterRolesGuard } from '../../../auth/cluster-roles.guard';
import { JwtAuthGuard } from '../../../auth/jwt.guard';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderCreateUserDto } from '../dtos/requests/create-user.dto';

import { TenderDeleteUserDto } from '../dtos/requests/delete-user.dto';
import { TenderUserService } from '../services/tender-user.service';

@Controller('tender-user')
export class TenderUserController {
  constructor(private readonly tenderUserService: TenderUserService) {}

  // @UseGuards(TenderJwtGuard)
  // @ClusterRoles('tender_admin')
  @Post('create')
  async createUser(
    @Body() request: TenderCreateUserDto,
  ): Promise<BaseResponse<user>> {
    const response = await this.tenderUserService.createEmployee(request);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'User created successfully!',
    );
  }

  // @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  // @ClusterRoles('tender_admin')
  @Post('delete')
  async deleteUser(
    @Body() request: TenderDeleteUserDto,
  ): Promise<BaseResponse<user>> {
    const { user_id } = request;
    const response = await this.tenderUserService.deleteEmployee(user_id);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'User deleted successfully!',
    );
  }
}
