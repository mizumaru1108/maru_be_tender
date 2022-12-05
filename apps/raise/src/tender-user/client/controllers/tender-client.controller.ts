import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt.guard';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { ICurrentUser } from '../../../user/interfaces/current-user.interface';
import { TenderCurrentUser } from '../../user/interfaces/current-user.interface';
import { ApproveEditRequestDto } from '../dtos/requests/approve-edit-request.dto';
import { ClientEditRequestDto } from '../dtos/requests/client-edit-request.dto';
import { ClientEditRequestResponseDto } from '../dtos/responses/client-edit-request.response.dto';
import { TenderClientService } from '../services/tender-client.service';

@Controller('tender-client')
export class TenderClientController {
  constructor(private readonly tenderClientService: TenderClientService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch('edit-request')
  async createEditRequest(
    @CurrentUser() user: ICurrentUser,
    @Body() editRequest: ClientEditRequestDto,
  ): Promise<BaseResponse<ClientEditRequestResponseDto>> {
    const response = await this.tenderClientService.createEditRequest(
      user,
      editRequest,
    );

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Asking for changes successfully applied!',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_accounts_manager')
  @Patch('approve-edit-request')
  async approveEditRequest(
    @CurrentUser() user: TenderCurrentUser,
    @Body() editRequest: ApproveEditRequestDto,
  ) {
    const response = await this.tenderClientService.acceptEditRequest(
      user.id,
      editRequest,
    );

    return baseResponseHelper(
      response.logs,
      HttpStatus.OK,
      'Asking for changes successfully applied!',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('approve-edit-requests')
  async approveEditRequests(
    @CurrentUser() user: ICurrentUser,
    @Body() editRequest: ClientEditRequestDto,
  ): Promise<BaseResponse<ClientEditRequestResponseDto>> {
    const response = await this.tenderClientService.createEditRequest(
      user,
      editRequest,
    );

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Asking for changes successfully applied!',
    );
  }
}
