import { PartialType } from '@nestjs/swagger';
import { CreateProposalThirdStepDto } from './create-proposal-third-step';

export class UpdateProposalThirdStepDto extends PartialType(
  CreateProposalThirdStepDto,
) {}
