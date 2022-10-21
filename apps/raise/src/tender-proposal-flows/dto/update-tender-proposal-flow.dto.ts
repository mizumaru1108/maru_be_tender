import { PartialType } from '@nestjs/swagger';
import { CreateTenderProposalFlowDto } from './create-tender-proposal-flow.dto';

export class UpdateTenderProposalFlowDto extends PartialType(CreateTenderProposalFlowDto) {}
