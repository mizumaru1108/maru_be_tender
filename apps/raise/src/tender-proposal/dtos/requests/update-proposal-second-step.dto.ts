import { PartialType } from '@nestjs/swagger';
import { CreateProposalSecondStepDto } from './create-proposal-second-step';

export class UpdateProposalSecondStepDto extends PartialType(
  CreateProposalSecondStepDto,
) {}
