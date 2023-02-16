import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';

import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';

import { ProposalCreateDto } from '../dtos/requests/proposal-create.dto';
import { ProposalDeleteDraftDto } from '../dtos/requests/proposal-delete-draft';
import { ProposalSaveDraftDto } from '../dtos/requests/proposal-save-draft';
import { TenderProposalService } from '../services/tender-proposal.service';
import { SendAmandementDto } from '../dtos/requests/send-amandement.dto';
import { FetchAmandementFilterRequest } from '../dtos/requests/fetch-amandement-filter-request.dto';
import { GetByUUIDQueryParamDto } from '../../../commons/dtos/get-by-uuid-query-param.dto';
import { SendRevisionDto } from '../dtos/requests/send-revision.dto';
@Controller('tender-proposal')
export class TenderProposalController {
  constructor(private readonly proposalService: TenderProposalService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('create')
  async create(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() payload: ProposalCreateDto,
  ) {
    const createdProposal = await this.proposalService.create(
      currentUser.id,
      payload,
    );
    return baseResponseHelper(
      createdProposal,
      HttpStatus.CREATED,
      'Proposal created successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Post('send-amandement')
  async sendAmandement(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() payload: SendAmandementDto,
  ) {
    const createdProposal = await this.proposalService.sendAmandement(
      currentUser.id,
      payload,
    );
    return baseResponseHelper(
      createdProposal,
      HttpStatus.CREATED,
      'Proposal amandement has been sended successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('delete-draft')
  async deleteDraft(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: ProposalDeleteDraftDto,
  ) {
    const deletedDraft = await this.proposalService.deleteDraft(
      currentUser.id,
      request.proposal_id,
    );
    return baseResponseHelper(
      deletedDraft,
      HttpStatus.OK,
      'Draft deleted successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor', 'tender_client')
  @Get('amandement-lists')
  async fetchAmandementList(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() payload: FetchAmandementFilterRequest,
  ) {
    const result = await this.proposalService.fetchAmandementList(
      currentUser,
      payload,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      payload.page || 1,
      payload.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor', 'tender_client')
  @Get('amandement')
  async getAmandementById(@Query() payload: GetByUUIDQueryParamDto) {
    const result = await this.proposalService.getAmandementById(payload.id);
    return baseResponseHelper(
      result,
      HttpStatus.OK,
      'Proposal Fetched Successfully!',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('fetch-track')
  async fetchTrack(
    @Query() { limit = 10, page = 1 }: BaseFilterRequest,
  ): Promise<BaseResponse<any>> {
    const result = await this.proposalService.fetchTrack(limit, page);

    return manualPaginationHelper(
      result.data,
      result.total,
      page,
      limit,
      HttpStatus.OK,
      'Success',
    );
  }

  /**
   * changing proposal state (acc/reject, create logs)
   */
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
  ) // only internal users
  @Patch('change-state')
  async changeProposalState(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: ChangeProposalStateDto,
  ) {
    const proposal = await this.proposalService.changeProposalState(
      currentUser,
      request,
    );
    return baseResponseHelper(
      proposal,
      HttpStatus.OK,
      `Proposal change state success!, current state: ${proposal.outter_status}, details: ${proposal.inner_status}`,
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Patch('save-draft')
  async saveDraft(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: ProposalSaveDraftDto,
  ) {
    const updateResponse = await this.proposalService.clientUpdateProposal(
      currentUser.id,
      request,
      undefined,
    );
    return baseResponseHelper(
      updateResponse,
      HttpStatus.OK,
      'Proposal updated successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Patch('send-revision')
  async sendRevision(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: SendRevisionDto,
  ) {
    const updateResponse = await this.proposalService.clientUpdateProposal(
      currentUser.id,
      undefined,
      request,
    );
    return baseResponseHelper(
      updateResponse,
      HttpStatus.OK,
      'Proposal updated successfully',
    );
  }
}
