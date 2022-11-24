import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClusterRoles } from '../../auth/cluster-roles.decorator';
import { ClusterRolesGuard } from '../../auth/cluster-roles.guard';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';
import { CreateProposalPaymentDto } from '../dtos/requests/payment/create-payment.dto';
import { UpdateProposalDto } from '../dtos/requests/update-proposal.dto';
import { UpdateProposalResponseDto } from '../dtos/responses/update-proposal-response.dto';
import { TenderProposalPaymentService } from '../services/tender-proposal-payment.service';

import { TenderProposalService } from '../services/tender-proposal.service';

@Controller('tender-proposal')
export class TenderProposalController {
  constructor(
    private readonly tenderProposalService: TenderProposalService,
    private readonly tenderProposalPaymentService: TenderProposalPaymentService,
  ) {}

  @UseGuards(JwtAuthGuard, ClusterRolesGuard)
  @ClusterRoles('tender_project_supervisor')
  @Post('insert-payment')
  async validatePayment(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() request: CreateProposalPaymentDto,
  ): Promise<BaseResponse<Prisma.paymentCreateManyInput[]>> {
    const createdPayment =
      await this.tenderProposalPaymentService.insertPayment(
        currentUser.id,
        request,
      );
    return baseResponseHelper(
      createdPayment,
      HttpStatus.CREATED,
      'Payment created successfully',
    );
  }

  /**
   * this endpoint is for changing the state of the proposal,
   * the status of proposal will be change, and the log will be created
   */
  @UseGuards(JwtAuthGuard)
  @Patch('change-state')
  changeProposalState(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() request: ChangeProposalStateDto,
  ) {
    return this.tenderProposalService.changeProposalState(currentUser, request);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-draft')
  async updateDraft(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() request: UpdateProposalDto,
  ): Promise<BaseResponse<UpdateProposalResponseDto>> {
    // console.log('current user', currentUser);
    const updateResponse = await this.tenderProposalService.updateProposal(
      currentUser.id,
      request,
    );
    return baseResponseHelper(
      updateResponse,
      HttpStatus.OK,
      'Proposal updated successfully',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-proposal')
  async updateProposal(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() request: UpdateProposalDto,
  ): Promise<BaseResponse<UpdateProposalResponseDto>> {
    const updateResponse = await this.tenderProposalService.updateProposal(
      currentUser.id,
      request,
    );
    return baseResponseHelper(
      updateResponse,
      HttpStatus.OK,
      'Proposal updated successfully',
    );
  }
}