import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
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

    return baseResponseHelper(response, HttpStatus.OK, 'Edit Request success!');
  }
}
