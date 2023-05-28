import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt.guard';
import { CreateBeneficiariesDto } from '../dtos/requests/create-beneficiaries.dto';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderProposalBeneficiaresService } from '../services/tender-proposal-beneficiaries.service';
import { UpdateBeneficiaryDto } from '../dtos/requests/update-beneficiaries.dto';

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
}
