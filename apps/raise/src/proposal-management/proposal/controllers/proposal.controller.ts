import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
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

import { CommandBus, QueryBus } from '@nestjs/cqrs';
// import { FileFieldsInterceptor } from '@webundsoehne/nest-fastify-file-upload';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from 'src/commons/decorators/base.api.ok.response.decorator';
import {
  SendRevisionCommand,
  SendRevisionCommandResult,
} from 'src/proposal-management/proposal/commands/send.revision/send.revision.command';
import { ProposalFindByIdQueryRequest } from 'src/proposal-management/proposal/dtos/queries/proposal.find.by.id.query.dto';
import {
  ProposalFindByIdQuery,
  ProposalFindByIdQueryResult,
} from 'src/proposal-management/proposal/queries/proposal.find.by.id.query/proposal.find.by.id.query';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from 'src/tender-commons/exceptions/forbidden-permission-exception';
import { BasePrismaErrorException } from 'src/tender-commons/exceptions/prisma-error/base.prisma.error.exception';
import { RequestErrorException } from 'src/tender-commons/exceptions/request-error.exception';
import { BasePaginationApiOkResponse } from '../../../commons/decorators/base.pagination.api.ok.response.decorator';
import { GetByIdDto } from '../../../commons/dtos/get-by-id.dto';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { InvalidTrackIdException } from '../../../track-management/track/exceptions/invalid-track-id.excception';
import { ProposalAskedEditRequestEntity } from '../../asked-edit-request/entities/proposal.asked.edit.request.entity';
import {
  AskAmandementRequestCommand,
  AskAmandementRequestCommandResult,
} from '../commands/ask.amandement.request/ask.amandement.request.command';
import { ChangeStateCommand } from '../commands/change.state/change.state.command';
import {
  ProposalCreateCommand,
  ProposalCreateCommandResult,
} from '../commands/proposal.create/proposal.create.command';
import {
  ProposalDeleteDraftCommand,
  ProposalDeleteDraftCommandResult,
} from '../commands/proposal.delete.draft/proposal.delete.draft.command';
import {
  ProposalSaveDraftCommand,
  ProposalSaveDraftCommandResult,
} from '../commands/proposal.save.draft/proposal.save.draft.command';
import { SendAmandementCommand } from '../commands/send.amandement/send.amandement.command';
import { ProposalFindMineQueryDto } from '../dtos/queries/proposal.find.mine.query.dto';
import { ProposalReportListQueryDto } from '../dtos/queries/proposal.report.list.query.dto';
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
import { ProposalEntity } from '../entities/proposal.entity';
import { ForbiddenChangeStateActionException } from '../exceptions/forbidden-change-state-action.exception';
import { ProposalNotFoundException } from '../exceptions/proposal-not-found.exception';
import {
  ProposalAskedEditRequestFindManyQuery,
  ProposalAskedEditRequestFindManyQueryResult,
} from '../queries/proposal.asked.edit.request.find.many.query/proposal.asked.edit.request.find.many.query';
import {
  ProposalFindMineQuery,
  ProposalFindMineQueryResult,
} from '../queries/proposal.find.mine.query/proposal.find.mine.query';
import {
  ProposalReportListQuery,
  ProposalReportListQueryResult,
} from '../queries/proposal.report.list/proposal.report.list.query';
import { ProposalService } from '../services/proposal.service';

@ApiTags('ProposalModule')
@Controller('tender-proposal')
export class TenderProposalController {
  constructor(
    private readonly proposalService: ProposalService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(error: any) {
    if (
      error instanceof ProposalNotFoundException ||
      error instanceof DataNotFoundException
    ) {
      return new NotFoundException(error.message);
    }
    if (
      error instanceof PayloadErrorException ||
      error instanceof InvalidTrackIdException
    ) {
      return new BadRequestException(error.message);
    }
    if (
      error instanceof ForbiddenChangeStateActionException ||
      error instanceof ForbiddenPermissionException
    ) {
      return new ForbiddenException(error.message);
    }
    if (error instanceof RequestErrorException) {
      return new UnprocessableEntityException(error.message);
    }

    if (error instanceof BasePrismaErrorException) {
      return new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error.message,
          error: error.stack ? JSON.parse(error.stack) : error.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return new InternalServerErrorException(error);
  }

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
    try {
      if (files.letter_ofsupport_req === undefined) {
        throw new BadRequestException('Letter of Support is Required!');
      }
      if (files.project_attachments === undefined) {
        throw new BadRequestException('Project attachment is Required!');
      }
      const command = Builder<ProposalCreateCommand>(ProposalCreateCommand, {
        userId: currentUser.id,
        request,
        letter_ofsupport_req: files.letter_ofsupport_req,
        project_attachments: files.project_attachments,
      }).build();

      const result = await this.commandBus.execute<
        ProposalCreateCommand,
        ProposalCreateCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Proposal created successfully',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor', 'tender_moderator')
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
    try {
      const command = Builder<ProposalDeleteDraftCommand>(
        ProposalDeleteDraftCommand,
        {
          user_id: currentUser.id,
          proposal_id: request.proposal_id,
        },
      ).build();

      const { data } = await this.commandBus.execute<
        ProposalDeleteDraftCommand,
        ProposalDeleteDraftCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.OK,
        'Draft deleted successfully',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary:
      'some roles asked supervisor to send a request to edit the proposal to user',
  })
  @BaseApiOkResponse(ProposalAskedEditRequestEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_finance')
  @Post('ask-amandement-request')
  async askForAmandementRequest(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: AskAmandementRequestDto,
  ) {
    try {
      const command = Builder<AskAmandementRequestCommand>(
        AskAmandementRequestCommand,
        {
          currentUser,
          request,
        },
      ).build();

      const result = await this.commandBus.execute<
        AskAmandementRequestCommand,
        AskAmandementRequestCommandResult
      >(command);

      return baseResponseHelper(
        result.data,
        HttpStatus.CREATED,
        'Amandement Request Submitted to Supervisor Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'Find Proposal for generating report (admin only)',
  })
  @BasePaginationApiOkResponse(ProposalEntity)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Get('report-list')
  async findMany(@Query() query: ProposalReportListQueryDto) {
    const builder = Builder<ProposalReportListQuery>(ProposalReportListQuery, {
      ...query,
      start_date: query.start_date ? new Date(query.start_date) : undefined,
      end_date: query.end_date ? new Date(query.end_date) : undefined,
    });

    const { result, total } = await this.queryBus.execute<
      ProposalReportListQuery,
      ProposalReportListQueryResult
    >(builder.build());

    return manualPaginationHelper(
      result,
      total,
      query.page || 1,
      query.limit || 10,
      HttpStatus.OK,
      'Proposal List Fetched Successfully!',
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

  // same as fetch by id but using cqrs
  @ApiBearerAuth()
  @BaseApiOkResponse(ProposalFindByIdQueryResult, 'object')
  @UseGuards(TenderJwtGuard)
  @Get('find-by-id')
  async findById(
    @Query() query: ProposalFindByIdQueryRequest,
  ): Promise<BaseResponse<ProposalFindByIdQueryResult>> {
    try {
      const queries = Builder<ProposalFindByIdQuery>(ProposalFindByIdQuery, {
        ...query,
        relation: query.relations,
      }).build();

      const result = await this.queryBus.execute<
        ProposalFindByIdQuery,
        ProposalFindByIdQueryResult
      >(queries);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Proposal fetched successfully',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({
    summary: 'find proposal that client has.',
  })
  @BasePaginationApiOkResponse(ProposalEntity)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Get('mine')
  async findMyProposal(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() query: ProposalFindMineQueryDto,
  ) {
    try {
      const builder = Builder<ProposalFindMineQuery>(ProposalFindMineQuery, {
        ...query,
        submitter_user_id: currentUser.id,
      });

      const { result, total } = await this.queryBus.execute<
        ProposalFindMineQuery,
        ProposalFindMineQueryResult
      >(builder.build());

      return manualPaginationHelper(
        result,
        total,
        query.page || 1,
        query.limit || 10,
        HttpStatus.OK,
        'Proposal List Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
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
  @TenderRoles(
    'tender_project_supervisor',
    'tender_client',
    'tender_ceo',
    'tender_project_manager',
    'tender_auditor_report',
    'tender_portal_report',
  )
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

  @ApiOperation({
    summary:
      'supervisor can see all roles that asked supervisor to send an amandement',
  })
  @BasePaginationApiOkResponse(ProposalAskedEditRequestEntity)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Get('amandement-request-lists')
  async fetchAmandementRequestList(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Query() query: FetchAmandementFilterRequest,
  ) {
    try {
      const builder = Builder<ProposalAskedEditRequestFindManyQuery>(
        ProposalAskedEditRequestFindManyQuery,
        {
          ...query,
          supervisor_id: currentUser.id,
          // supervisor_track_id: currentUser.track_id,
        },
      );

      const { result, total } = await this.queryBus.execute<
        ProposalAskedEditRequestFindManyQuery,
        ProposalAskedEditRequestFindManyQueryResult
      >(builder.build());

      return manualPaginationHelper(
        result,
        total,
        query.page || 1,
        query.limit || 10,
        HttpStatus.OK,
        'Amandement Request List Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
    // const result = await this.proposalService.fetchAmandementRequestList(
    //   currentUser,
    //   payload,
    // );

    // return manualPaginationHelper(
    //   result.data,
    //   result.total,
    //   payload.page || 1,
    //   payload.limit || 10,
    //   HttpStatus.OK,
    //   'Success',
    // );
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
      throw this.errorMapper(error);
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
    try {
      const command = Builder<ProposalSaveDraftCommand>(
        ProposalSaveDraftCommand,
        {
          userId: currentUser.id,
          request,
          letter_ofsupport_req: files.letter_ofsupport_req,
          project_attachments: files.project_attachments,
        },
      ).build();

      const result = await this.commandBus.execute<
        ProposalSaveDraftCommand,
        ProposalSaveDraftCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Proposal created successfully',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  // client send revised version of the proposal so it goes back to the flow (not reveied anymore)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'letter_ofsupport_req', maxCount: 1 },
      { name: 'project_attachments', maxCount: 1 },
    ]),
  )
  @Patch('send-revision-cqrs')
  async sendRevision(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: SendRevisionDto,
    @UploadedFiles()
    files: {
      letter_ofsupport_req?: any; //Express.Multer.File[] | undefined;
      project_attachments?: any; //Express.Multer.File[] | undefined;
    },
  ) {
    try {
      const command = Builder<SendRevisionCommand>(SendRevisionCommand, {
        userId: currentUser.id,
        request,
        letter_ofsupport_req: files.letter_ofsupport_req,
        project_attachments: files.project_attachments,
      }).build();

      const result = await this.commandBus.execute<
        SendRevisionCommand,
        SendRevisionCommandResult
      >(command);

      return baseResponseHelper(
        result.proposal,
        HttpStatus.CREATED,
        'Send Revision Submitted Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
