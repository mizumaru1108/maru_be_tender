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
import { ICurrentUser } from '../../../user/interfaces/current-user.interface';
import { ClientEditRequestFieldDto } from '../dtos/requests/client-edit-request-field.dto';
import { EditRequestByIdDto } from '../dtos/requests/edit-request-by-id.dto';
import { SearchEditRequestFilter } from '../dtos/requests/search-edit-request-filter-request.dto';
import { ClientEditRequestResponseDto } from '../dtos/responses/client-edit-request.response.dto';
import { TenderClientService } from '../services/tender-client.service';

@Controller('tender/client')
export class TenderClientController {
  constructor(private readonly tenderClientService: TenderClientService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('edit-request/create')
  async createEditRequest(
    @CurrentUser() user: ICurrentUser,
    @Body() editRequest: ClientEditRequestFieldDto,
  ): Promise<BaseResponse<any>> {
    // console.log('payload', JSON.stringify(editRequest, null, 2));
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
    @CurrentUser() user: ICurrentUser,
  ): Promise<BaseResponse<string | null>> {
    const track = await this.tenderClientService.getUserTrack(user.id);
    return baseResponseHelper(
      track,
      HttpStatus.OK,
      'Successfully fetch current user track',
    );
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
      filter.requestid,
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
    @CurrentUser() currentUser: ICurrentUser,
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
    @CurrentUser() user: ICurrentUser,
    @Body() editRequest: EditRequestByIdDto,
  ): Promise<BaseResponse<any>> {
    const response = await this.tenderClientService.acceptEditRequests(
      user.id,
      editRequest.requestid,
    );

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Asking for changes successfully applied!',
    );
  }
}
