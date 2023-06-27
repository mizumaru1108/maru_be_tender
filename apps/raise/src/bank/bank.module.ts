import { Module } from '@nestjs/common';
import { BankInformationRepository } from './repositories/bank-information.repository';

@Module({
  providers: [BankInformationRepository],
  exports: [BankInformationRepository],
})
export class BankModule {}
