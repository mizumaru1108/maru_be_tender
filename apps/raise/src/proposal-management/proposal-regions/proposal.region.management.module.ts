import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalGovernorateModule } from './governorate/proposal.governorate.module';
import { ProposalRegionModule } from './region/proposal.region.module';

const importedModule = [
  CqrsModule,
  ProposalRegionModule,
  ProposalGovernorateModule,
];
@Module({
  imports: [...importedModule],
})
export class ProposalRegionsModule {}
