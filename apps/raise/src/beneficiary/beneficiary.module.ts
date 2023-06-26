import { Module } from '@nestjs/common';
import { BeneficiariesController } from './controllers/beneficiary.controller';
import { BeneficiaresService } from './services/beneficiaries.service';
import { BeneficiariesRepository } from './repositories/beneficiaries.repository';

@Module({
  imports: [],
  controllers: [BeneficiariesController],
  providers: [BeneficiaresService, BeneficiariesRepository],
})
export class BeneficiaryModule {}
