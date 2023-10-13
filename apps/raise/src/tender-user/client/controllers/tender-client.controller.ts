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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';
import { BaseApiOkResponse } from '../../../commons/decorators/base.api.ok.response.decorator';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { EditRequestEntity } from '../../edit-requests/entities/edit.request.entity';
import {
  ClientCreateEditRequestCommand,
  ClientCreateEditRequestCommandResult,
} from '../commands/client.create.edit.request/client.create.edit.request.command';
import {
  ClientEditRequestChangeStatusCommand,
  ClientEditRequestChangeStatusCommandResult,
} from '../commands/client.edit.request.change.status/client.edit.request.change.status.command';
import { ClientFieldAndIdQueryDto } from '../dtos/queries/client.find.name.and.id.query.dto';
import {
  ClientEditRequestFieldDto,
  EditRequestByIdDto,
  SearchClientProposalFilter,
  SearchEditRequestFilter,
  SearchSpecificClientProposalFilter,
} from '../dtos/requests';
import { EditRequestChangeStatusDto } from '../dtos/requests/edit.request.change.status.dto';
import {
  ClientFindNameAndIdQuery,
  ClientFindNameAndIdQueryResult,
} from '../queries/client.find.name.and.id/client.find.name.and.id.query';
import { TenderClientService } from '../services/tender-client.service';
@ApiTags('ClientModule')
@Controller('tender/client')
export class TenderClientController {
  constructor(
    private readonly tenderClientService: TenderClientService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles('tender_client')
  // @Post('edit-request/create')
  // async createEditRequest(
  //   @CurrentUser() user: TenderCurrentUser,
  //   @Body() editRequest: ClientEditRequestFieldDto,
  // ): Promise<BaseResponse<any>> {
  //   const response = await this.tenderClientService.createEditRequest(
  //     user,
  //     editRequest,
  //   );

  //   return baseResponseHelper(
  //     response,
  //     HttpStatus.OK,
  //     'Asking for changes successfully applied!, please wait untill account manager responded to your request',
  //   );
  // }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('edit-request/create')
  async createEditRequestCqrs(
    @CurrentUser() user: TenderCurrentUser,
    @Body() editRequest: ClientEditRequestFieldDto,
  ): Promise<BaseResponse<any>> {
    try {
      const command = Builder<ClientCreateEditRequestCommand>(
        ClientCreateEditRequestCommand,
        {
          user,
          editRequest,
        },
      ).build();

      const result = await this.commandBus.execute<
        ClientCreateEditRequestCommand,
        ClientCreateEditRequestCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Advertisement Created Successfully!',
      );
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary: 'Find client name and id',
  })
  @Get()
  async findClientName(@Query() query: ClientFieldAndIdQueryDto) {
    const builder = Builder<ClientFindNameAndIdQuery>(
      ClientFindNameAndIdQuery,
      {
        ...query,
      },
    );

    const { result, total } = await this.queryBus.execute<
      ClientFindNameAndIdQuery,
      ClientFindNameAndIdQueryResult
    >(builder.build());

    return manualPaginationHelper(
      result,
      total,
      query.page || 1,
      query.limit || 10,
      HttpStatus.OK,
      'Client List Fetched Successfully!',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('current-user-track')
  async getCurrentUserTrack(
    @CurrentUser() user: TenderCurrentUser,
  ): Promise<BaseResponse<string | null>> {
    const track = await this.tenderClientService.getUserTrack(user.id);
    return baseResponseHelper(
      track,
      HttpStatus.OK,
      'Successfully fetch current user track',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Get('my-profile')
  async getMyProfile(
    @CurrentUser() user: TenderCurrentUser,
  ): Promise<BaseResponse<any>> {
    const response = await this.tenderClientService.getMyProfile(user.id);
    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Successfully fetch current user track',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_ceo',
    'tender_project_manager',
    'tender_admin',
    'tender_accounts_manager',
    'tender_project_supervisor',
  )
  @Get('proposal/list')
  async findProposalList(
    @Query() filter: SearchClientProposalFilter,
  ): Promise<any> {
    const response = await this.tenderClientService.findClientProposals(filter);

    return manualPaginationHelper(
      response.data,
      response.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
    // return response;
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_ceo',
    'tender_project_manager',
    'tender_admin',
    'tender_cashier',
    'tender_finance',
    'tender_moderator',
    'tender_project_supervisor',
    'tender_consultant',
    'tender_accounts_manager',
  )
  @Get('proposals')
  async findClientProposalById(
    @Query() filter: SearchSpecificClientProposalFilter,
  ): Promise<any> {
    const response = await this.tenderClientService.findClientProposalById(
      filter,
    );

    return manualPaginationHelper(
      response.data,
      response.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
    // return response;
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Get('edit-request/list')
  async findEditRequest(
    @Query() filter: SearchEditRequestFilter,
  ): Promise<ManualPaginatedResponse<any>> {
    const response = await this.tenderClientService.findEditRequests(filter);

    return manualPaginationHelper(
      response.data,
      response.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Get('edit-request/find')
  async find(
    @Query() filter: EditRequestByIdDto,
  ): Promise<ManualPaginatedResponse<any>> {
    const response = await this.tenderClientService.findEditRequestByLogId(
      filter.requestId,
    );
    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Edit Request Data Successfully Fetched!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Get('edit-request/my-pending-count')
  async getPendingCount(
    @CurrentUser() currentUser: TenderCurrentUser,
  ): Promise<ManualPaginatedResponse<any>> {
    const response = await this.tenderClientService.findMyPendingLogCount(
      currentUser.id,
    );
    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Edit Request Data Successfully Fetched!',
    );
  }

  @ApiOperation({ summary: 'Edit Request Change Status' })
  @BaseApiOkResponse(EditRequestEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Patch('edit-requests/change-status')
  async changeStatus(
    @CurrentUser() user: TenderCurrentUser,
    @Body() request: EditRequestChangeStatusDto,
  ): Promise<BaseResponse<any>> {
    try {
      const command = Builder<ClientEditRequestChangeStatusCommand>(
        ClientEditRequestChangeStatusCommand,
        {
          ...request,
          reviewerId: user.id,
        },
      ).build();

      const result = await this.commandBus.execute<
        ClientEditRequestChangeStatusCommand,
        ClientEditRequestChangeStatusCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Edit Request Status Changed!',
      );
    } catch (e) {
      throw e;
    }
  }
}
