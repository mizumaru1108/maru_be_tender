import {
  Controller,
  UseGuards,
  Post,
  Body,
  HttpStatus,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { GetByUUIDQueryParamDto } from '../../commons/dtos/get-by-uuid-query-param.dto';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { CreateBeneficiariesDto } from '../dtos/requests/create-beneficiaries.dto';
import { FindBeneficiariesFilterRequest } from '../dtos/requests/find-beneficiaries.dto';
import { UpdateBeneficiaryDto } from '../dtos/requests/update-beneficiaries.dto';
import { BeneficiaresService } from '../services/beneficiaries.service';

@Controller('tender/proposal/beneficiaries')
export class BeneficiariesController {
  constructor(private readonly beneficiariesService: BeneficiaresService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create')
  async create(@Body() request: CreateBeneficiariesDto) {
    const beneficiary = await this.beneficiariesService.create(request);
    return baseResponseHelper(
      beneficiary,
      HttpStatus.CREATED,
      'Beneficiary created successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update')
  async update(@Body() request: UpdateBeneficiaryDto) {
    const beneficiary = await this.beneficiariesService.update(request);
    return baseResponseHelper(
      beneficiary,
      HttpStatus.CREATED,
      'Proposal updated successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('find-by-id')
  async findById(@Query() request: GetByUUIDQueryParamDto) {
    const beneficiary = await this.beneficiariesService.find(request.id);
    return baseResponseHelper(
      beneficiary,
      HttpStatus.CREATED,
      'Proposal fetched successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('find-all')
  async findAll(@Query() filter: FindBeneficiariesFilterRequest) {
    const result = await this.beneficiariesService.findAll(filter);

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 0,
      HttpStatus.OK,
      'Success',
    );
  }
}
