import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from './dtos/requests/change-proposal-state.dto';
import { TenderProposalService } from './tender-proposal.service';

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
}
