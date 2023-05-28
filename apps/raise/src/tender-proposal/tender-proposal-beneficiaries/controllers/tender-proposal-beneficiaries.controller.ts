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
import { JwtAuthGuard } from '../../../auth/guards/jwt.guard';
import { CreateBeneficiariesDto } from '../dtos/requests/create-beneficiaries.dto';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderProposalBeneficiaresService } from '../services/tender-proposal-beneficiaries.service';
import { UpdateBeneficiaryDto } from '../dtos/requests/update-beneficiaries.dto';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { FindBeneficiariesFilterRequest } from '../dtos/requests/find-beneficiaries.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { GetByUUIDQueryParamDto } from '../../../commons/dtos/get-by-uuid-query-param.dto';

@Controller('tender/proposal/beneficiaries')
export class TenderProposalBeneficiariesController {
  constructor(
    private readonly beneficiariesService: TenderProposalBeneficiaresService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() request: CreateBeneficiariesDto) {
    const beneficiary = await this.beneficiariesService.create(request);
    return baseResponseHelper(
      beneficiary,
      HttpStatus.CREATED,
      'Beneficiary created successfully',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async update(@Body() request: UpdateBeneficiaryDto) {
    const beneficiary = await this.beneficiariesService.update(request);
    return baseResponseHelper(
      beneficiary,
      HttpStatus.CREATED,
      'Proposal created successfully',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-by-id')
  async findById(@Query() request: GetByUUIDQueryParamDto) {
    const beneficiary = await this.beneficiariesService.find(request.id);
    return baseResponseHelper(
      beneficiary,
      HttpStatus.CREATED,
      'Proposal created successfully',
    );
  }

  @UseGuards(JwtAuthGuard)
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
