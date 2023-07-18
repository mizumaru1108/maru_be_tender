import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';

import { BaseFilterRequest } from '../../../commons/dtos/base-filter-request.dto';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';

import { CommandBus } from '@nestjs/cqrs';
// import { FileFieldsInterceptor } from '@webundsoehne/nest-fastify-file-upload';
import { Builder } from 'builder-pattern';
import { RequestErrorException } from 'src/tender-commons/exceptions/request-error.exception';
import { GetByIdDto } from '../../../commons/dtos/get-by-id.dto';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { InvalidTrackIdException } from '../../../tender-track/track/exceptions/invalid-track-id.excception';
import { ChangeStateCommand } from '../commands/change.state/change.state.command';
import { SendAmandementCommand } from '../commands/send.amandement/send.amandement.command';
import {
  AskAmandementRequestDto,
  ChangeProposalStateDto,
  CreateProposalInterceptorDto,
  FetchAmandementFilterRequest,
  FetchClosingReportListFilterRequest,
  FetchProposalFilterRequest,
  FetchRejectionListFilterRequest,
  PaymentAdjustmentFilterRequest,
  PreviousProposalFilterRequest,
  ProposalDeleteDraftDto,
  ProposalSaveDraftInterceptorDto,
  RequestInProcessFilterRequest,
  SendAmandementDto,
  SendRevisionDto,
} from '../dtos/requests';
import { ForbiddenChangeStateActionException } from '../exceptions/forbidden-change-state-action.exception';
import { ProposalNotFoundException } from '../exceptions/proposal-not-found.exception';
import { ProposalService } from '../services/proposal.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
@Controller('tender-proposal')
export class TenderProposalController {
  constructor(
    private readonly proposalService: ProposalService,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'letter_ofsupport_req', maxCount: 1 },
      { name: 'project_attachments', maxCount: 1 },
    ]),
  )
  @Post('interceptor-create')
  async createProposal(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateProposalInterceptorDto,
    @UploadedFiles()
    files: {
      letter_ofsupport_req?: Express.Multer.File[];
      project_attachments?: Express.Multer.File[];
    },
  ) {
    if (files.letter_ofsupport_req === undefined) {
      throw new BadRequestException('Letter of Support is Required!');
    }
    if (files.project_attachments === undefined) {
      throw new BadRequestException('Project attachment is Required!');
    }
    const createdProposal = await this.proposalService.interceptorCreate(
      currentUser.id,
      request,
      files.letter_ofsupport_req,
      files.project_attachments,
    );
    return baseResponseHelper(
      createdProposal,
      HttpStatus.CREATED,
      'Proposal created successfully',
    );
  }

  // supervisor asked to client for revision
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
  @TenderRoles('tender_project_supervisor')
  @Post('send-amandement-cqrs')
  async sendAmandementCqrs(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: SendAmandementDto,
  ) {
    try {
      const sendAmandement = Builder<SendAmandementCommand>(
        SendAmandementCommand,
        {
          currentUser,
          request,
        },
      ).build();

      const result = await this.commandBus.execute(sendAmandement);
      return baseResponseHelper(result, HttpStatus.OK);
    } catch (error) {
      return this.errorMapper(error);
    }
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

  // DEPRECARED (all roles asked supervisor to send a request to edit the proposal to user)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
  )
  @Post('ask-amandement-request')
  async askForAmandementRequest(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: AskAmandementRequestDto,
  ) {
    const result = await this.proposalService.askAmandementRequest(
      currentUser,
      request,
    );
    return baseResponseHelper(
      result,
      HttpStatus.OK,
      'Draft deleted successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('request-in-process')
  async requestInProcess(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: RequestInProcessFilterRequest,
  ) {
    const result = await this.proposalService.fetchRequestInProcess(
      currentUser,
      filter,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 0,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('previous')
  async getPreviousProposal(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: PreviousProposalFilterRequest,
  ) {
    const result = await this.proposalService.getPreviousProposal(
      currentUser,
      filter,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 0,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_project_manager',
    'tender_project_supervisor',
    'tender_finance',
    'tender_cashier',
  )
  @Get('payment-adjustment')
  async fetchPaymentAdjustment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: PaymentAdjustmentFilterRequest,
  ) {
    const result = await this.proposalService.fetchPaymentAdjustment(
      currentUser,
      filter,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 0,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('fetch-by-id')
  async fetchById(@Query() payload: GetByIdDto) {
    const result = await this.proposalService.fetchProposalById(payload.id);

    return baseResponseHelper(
      result,
      HttpStatus.OK,
      'Proposal fetched successfully',
    );
  }

  // both supervisor and client can see the amandment list
  // (supervisor can see what amandement that it send to the client)
  // client can see the list of amandement that sented by the supervisor
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_project_supervisor',
    'tender_client',
    'tender_project_manager',
    'tender_consultant',
    'tender_cashier',
    'tender_finance',
  )
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
  @TenderRoles('tender_project_manager', 'tender_ceo')
  @Get('rejection-list')
  async fetchRejectionList(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() payload: FetchRejectionListFilterRequest,
  ) {
    const result = await this.proposalService.fetchRejectionList(
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
  @Get('closing-report-list')
  async fetchClosingReportList(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() payload: FetchClosingReportListFilterRequest,
  ) {
    const result = await this.proposalService.fetchClosingReportList(
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

  // DEPRECATED (supervisor can see all roles that asked supervisor to send an amandement)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Get('amandement-request-lists')
  async fetchAmandementRequestList(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() payload: FetchAmandementFilterRequest,
  ) {
    const result = await this.proposalService.fetchAmandementRequestList(
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

  @UseGuards(TenderJwtGuard)
  @Get('list')
  async fetchProposalList(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: FetchProposalFilterRequest,
  ) {
    const result = await this.proposalService.fetchProposalList(
      currentUser,
      filter,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('proposal-count')
  async getProposalCount(@CurrentUser() currentUser: TenderCurrentUser) {
    const result = await this.proposalService.getProposalCount(currentUser);

    return baseResponseHelper(
      result,
      HttpStatus.OK,
      'Proposal Fetched Successfully!',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('/old/list')
  async fetchOldProposalList(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() filter: FetchProposalFilterRequest,
  ) {
    const result = await this.proposalService.fetchOldProposalList(
      currentUser,
      filter,
    );

    return manualPaginationHelper(
      result.data,
      result.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor', 'tender_client')
  @Get('amandement')
  async getAmandementById(@Query() payload: GetByIdDto) {
    const result = await this.proposalService.getAmandementByProposalId(
      payload.id,
    );
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

  /* experimental */
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
  @Patch('change-state-cqrs')
  async applyChangeProposalState(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: ChangeProposalStateDto,
  ) {
    try {
      const proposalCommand = Builder<ChangeStateCommand>(ChangeStateCommand, {
        currentUser,
        request,
      }).build();

      const result = await this.commandBus.execute(proposalCommand);
      return baseResponseHelper(result, HttpStatus.OK);
    } catch (error) {
      if (error instanceof ProposalNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (
        error instanceof PayloadErrorException ||
        error instanceof InvalidTrackIdException
      ) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof ForbiddenChangeStateActionException) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'letter_ofsupport_req', maxCount: 1 },
      { name: 'project_attachments', maxCount: 1 },
    ]),
  )
  @Patch('interceptor-save-draft')
  async interceptorSaveDraft(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: ProposalSaveDraftInterceptorDto,
    @UploadedFiles()
    files: {
      letter_ofsupport_req?: any;
      project_attachments?: any;
    },
  ) {
    const createdProposal =
      await this.proposalService.clientUpdateProposalInterceptor(
        currentUser.id,
        request,
        undefined,
        files.letter_ofsupport_req,
        files.project_attachments,
      );
    return baseResponseHelper(
      createdProposal,
      HttpStatus.CREATED,
      'Proposal created successfully',
    );
  }

  // client send revised version of the proposal so it goes back to the flow (not reveied anymore)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Patch('send-revision')
  async sendRevision(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: SendRevisionDto,
  ) {
    const updateResponse =
      await this.proposalService.clientUpdateProposalInterceptor(
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

  errorMapper(error: any) {
    if (error instanceof ProposalNotFoundException) {
      throw new NotFoundException(error.message);
    }
    if (
      error instanceof PayloadErrorException ||
      error instanceof InvalidTrackIdException
    ) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof ForbiddenChangeStateActionException) {
      throw new ForbiddenException(error.message);
    }
    if (error instanceof RequestErrorException) {
      throw new UnprocessableEntityException(`${error}`);
    }
  }
}
