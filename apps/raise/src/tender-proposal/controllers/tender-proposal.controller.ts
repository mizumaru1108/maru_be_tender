import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { BaseHashuraWebhookPayload } from '../../commons/interfaces/base-hashura-webhook-payload';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';
import { TenderProposalService } from '../services/tender-proposal.service';

@Controller('tender-proposal')
export class TenderProposalController {
  constructor(private readonly tenderProposalService: TenderProposalService) {}

  /**
   * this endpoint is for changing the state of the proposal,
   * the status of proposal will be change, and the log will be created
   */
  @UseGuards(JwtAuthGuard)
  @Patch('current-change-state')
  changeProposalState(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() request: ChangeProposalStateDto,
  ) {
    return this.tenderProposalService.changeProposalState(currentUser, request);
  }

  @Post('update-fourth-step-draft')
  async postUpdateFourthStep(@Body() payload: any) {
    console.log('payload', payload);
    console.log('payload data', JSON.stringify(payload.event.data));
  }
}
