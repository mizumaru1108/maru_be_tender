import { Injectable } from '@nestjs/common';
import { CreateTenderProposalFlowDto } from './dto/create-tender-proposal-flow.dto';
import { UpdateTenderProposalFlowDto } from './dto/update-tender-proposal-flow.dto';

@Injectable()
export class TenderProposalFlowsService {
  create(createTenderProposalFlowDto: CreateTenderProposalFlowDto) {
    return 'This action adds a new tenderProposalFlow';
  }

  findAll() {
    return `This action returns all tenderProposalFlows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenderProposalFlow`;
  }

  update(id: number, updateTenderProposalFlowDto: UpdateTenderProposalFlowDto) {
    return `This action updates a #${id} tenderProposalFlow`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenderProposalFlow`;
  }
}
