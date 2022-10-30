import { PartialType } from '@nestjs/swagger';
import { CreateProposalFirstStepDto } from './create-proposal-first-step.dto';

export class UpdateProposalFirstStepDto extends PartialType(
  CreateProposalFirstStepDto,
) {}
