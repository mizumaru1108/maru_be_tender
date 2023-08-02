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
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import {
  ClientEditRequestFieldDto,
  EditRequestByIdDto,
  RejectEditRequestDto,
  SearchClientProposalFilter,
  SearchEditRequestFilter,
  SearchSpecificClientProposalFilter,
} from '../dtos/requests';
import { TenderClientService } from '../services/tender-client.service';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';

@Controller('tender/client')
export class TenderClientController {
  constructor(private readonly tenderClientService: TenderClientService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('edit-request/create')
  async createEditRequest(
    @CurrentUser() user: TenderCurrentUser,
    @Body() editRequest: ClientEditRequestFieldDto,
  ): Promise<BaseResponse<any>> {
    const response = await this.tenderClientService.createEditRequest(
      user,
      editRequest,
    );

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Asking for changes successfully applied!, please wait untill account manager responded to your request',
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

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Patch('approve-edit-requests')
  async approveEditRequests(
    @CurrentUser() user: TenderCurrentUser,
    @Body() editRequest: EditRequestByIdDto,
  ): Promise<BaseResponse<any>> {
    const response = await this.tenderClientService.acceptEditRequests(
      user.id,
      editRequest.requestId,
    );

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Asking for changes successfully applied!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Patch('reject-edit-requests')
  async rejectEditRequests(
    @CurrentUser() user: TenderCurrentUser,
    @Body() request: RejectEditRequestDto,
  ): Promise<BaseResponse<any>> {
    const response = await this.tenderClientService.rejectEditRequests(
      user.id,
      request,
    );

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Asking for changes successfully applied!',
    );
  }
}
