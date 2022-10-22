import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';
import { TenderProposalFlowService } from './tender-proposal-flow.service';
import { TenderProposalLogService } from './tender-proposal-log.service';
// import { nanoid } from 'nanoid';
@Injectable()
export class TenderProposalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tenderProposalLogService: TenderProposalLogService,
    private readonly tenderProposalFlowService: TenderProposalFlowService,
  ) {}

  async changeProposalState(
    currentUser: ICurrentUser,
    request: ChangeProposalStateDto,
  ) {
    // console.log('currentUser', currentUser);
    // console.log('request', request);

    // get the flow to determine where is the next step
    const flow = await this.tenderProposalFlowService.getFlow(
      request.track_name,
    );

    const proposalLogPayload = {
      // id require nano id (cant just import bescause es module on tsconfig)
      id: require('nanoid').nanoid(),
      proposalId: request.proposal_id,
      reviewer_id: currentUser.id,
    };
    const result = await this.prismaService.project_tracks.findMany();
    console.log('result', result);
    return result;
  }
}
