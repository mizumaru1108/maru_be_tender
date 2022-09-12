import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { Permissions } from '../../auth/permissions.decorator';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { Permission } from '../../libs/authzed/enums/permission.enum';
import { rootLogger } from '../../logger';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { AddMilestoneDto } from '../dto/milestone/requests/add-milestone.dto';
import { DeleteMilestoneDto } from '../dto/milestone/requests/delete-milestone.dto';
import { EditMilestoneDto } from '../dto/milestone/requests/edit-milestone.dto';
import { AddMilestoneResponseDto } from '../dto/milestone/responses/add-milestone-response.dto';
import { UpdateMilestoneResponseDto } from '../dto/milestone/responses/update-milestone-response';
import { Campaign } from '../schema/campaign.schema';
import { CampaignMilestoneService } from '../services/campaign-milestone.service';

@ApiTags('campaignMilestone')
@Controller('campaignMilestone')
export class CampaignMilestoneController {
  private logger = rootLogger.child({
    logger: CampaignMilestoneController.name,
  });

  constructor(
    private readonly campaignMilestoneService: CampaignMilestoneService,
  ) {}

  /* add milestones to existing campaign (make it seperate with edit campaign)*/
  @ApiOperation({
    summary: 'Add new (extra milestone) after campaign already created',
  })
  @ApiResponse({
    status: 201,
    description: 'New milestone added to campaign `campaignId` successfully!',
  })
  @Permissions(Permission.OE)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('addMilestone')
  async addCampaignMilestone(
    @CurrentUser() user: ICurrentUser,
    @Body() request: AddMilestoneDto,
  ): Promise<BaseResponse<AddMilestoneResponseDto>> {
    this.logger.debug(
      `create new milestone for campaign ${request.campaignId}`,
      JSON.stringify(request),
    );
    const addResponse = await this.campaignMilestoneService.addMilestone(
      user.id,
      request,
    );
    return baseResponseHelper(
      addResponse,
      HttpStatus.CREATED,
      `New milestone added to campaign ${request.campaignId} successfully!`,
    );
  }

  /* edit milestone on existing campaign (make it seperate with edit campaign)*/
  @ApiOperation({
    summary: 'Edit milestone on existing campaign',
  })
  @ApiResponse({
    status: 200,
    description:
      'Milestone `milestoneId` has been updated successfully successfully!',
  })
  @Permissions(Permission.OE)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('editMilestone')
  async editCampaignMilestone(
    @CurrentUser() user: ICurrentUser,
    @Body() request: EditMilestoneDto,
  ): Promise<BaseResponse<UpdateMilestoneResponseDto>> {
    this.logger.debug(
      `apply update milestone ${request.milestoneId} on campaign ${request.campaignId}`,
      JSON.stringify(request),
    );
    const editResponse = await this.campaignMilestoneService.editMilestone(
      user.id,
      request,
    );
    return baseResponseHelper(
      editResponse,
      HttpStatus.OK,
      `Milestone ${request.milestoneId} has been updated successfully successfully!`,
    );
  }

  // delete milestone on existing campaign (make it seperate with edit campaign)
  @ApiOperation({
    summary: 'Delete milestone on existing campaign',
  })
  @ApiResponse({
    status: 200,
    description:
      'Milestone `milestoneId` has been deleted successfully successfully!',
  })
  @Permissions(Permission.OE)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('deleteMilestone')
  async deleteCampaignMilestone(
    @CurrentUser() user: ICurrentUser,
    @Body() request: DeleteMilestoneDto,
  ): Promise<BaseResponse<Campaign>> {
    this.logger.debug(
      `apply remove milestone ${request.milestoneId} on campaign ${request.campaignId}`,
    );
    const editResponse = await this.campaignMilestoneService.deleteMilestone(
      user.id,
      request,
    );
    return baseResponseHelper(
      editResponse,
      HttpStatus.OK,
      `Milestone ${request.milestoneId} has been deleted successfully successfully!`,
    );
  }
}
