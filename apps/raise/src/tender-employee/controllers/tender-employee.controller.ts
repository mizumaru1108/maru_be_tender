import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { user } from '@prisma/client';
import { ClusterRoles } from '../../auth/cluster-roles.decorator';
import { ClusterRolesGuard } from '../../auth/cluster-roles.guard';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { CreateEmployeeDto } from '../dtos/requests/create-employee.dto';
import { DeleteEmployeeDto } from '../dtos/requests/delete-employee.dto';
import { TenderEmployeeService } from '../services/tender-employee.service';

@Controller('tender-employee')
export class TenderEmployeeController {
  constructor(private readonly tenderEmployeeService: TenderEmployeeService) {}

  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  @ClusterRoles('tender_admin')
  @Post('create')
  async createEmployee(
    @Body() request: CreateEmployeeDto,
  ): Promise<BaseResponse<user>> {
    const response = await this.tenderEmployeeService.createEmployee(request);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'User created successfully!',
    );
  }

  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  @ClusterRoles('tender_admin')
  @Post('delete')
  async deleteEmployee(
    @Body() request: DeleteEmployeeDto,
  ): Promise<BaseResponse<user>> {
    const { user_id } = request;
    const response = await this.tenderEmployeeService.deleteEmployee(user_id);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'User created successfully!',
    );
  }
}
