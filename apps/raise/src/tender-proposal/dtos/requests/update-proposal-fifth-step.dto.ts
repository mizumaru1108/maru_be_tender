import { PartialType } from '@nestjs/swagger';
import { CreateProposalFifthStepDto } from './create-proposal-fifth-step';

export class UpdateProposalFifthStepDto extends PartialType(
  CreateProposalFifthStepDto,
) {}
