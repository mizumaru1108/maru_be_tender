import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';
import { UpdateProposalDto } from '../dtos/requests/update-proposal.dto';

import { UpdateProposalFourthStepResponseDto } from '../dtos/responses/update-proposal-fourth-step-response.dto';
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

  @UseGuards(JwtAuthGuard)
  @Patch('update-proposal')
  async updateProposal(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() request: UpdateProposalDto,
  ) {
    // console.log('current user', currentUser);
    const response = await this.tenderProposalService.updateProposal(
      currentUser.id,
      request,
    );
    console.log('response', response);
  }
  // @UseGuards(JwtAuthGuard)
  // @Patch('update-fourth-step')
  // async updateFourthStep(
  //   @Body() payload: UpdateProposalDraftFourthStepDto,
  // ): Promise<BaseResponse<UpdateProposalFourthStepResponseDto>> {
  //   const updatedFourthStep = await this.tenderProposalService.updateFourthStep(
  //     payload,
  //   );
  //   return baseResponseHelper(
  //     updatedFourthStep,
  //     HttpStatus.OK,
  //     'Update fourth step success!',
  //   );
  // }
}
