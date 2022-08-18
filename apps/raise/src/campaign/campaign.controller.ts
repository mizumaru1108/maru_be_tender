import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ClusterRoles } from '../auth/cluster-roles.decorator';

import { DonorService } from '../donor/donor.service';
import { rootLogger } from '../logger';
import { RoleEnum } from '../user/enums/role-enum';
import { CampaignService } from './campaign.service';
import { CampaignSetFavoriteDto, CreateCampaignDto } from './dto';
import { CampaignSetDeletedFlagDto } from './dto/capaign-set-flag-deleted';
import { UpdateCampaignDto } from './dto/update-campaign-dto';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { BaseResponse } from '../commons/dtos/base-response';
import { Campaign } from './campaign.schema';

@ApiTags('campaign')
@Controller('campaign')
export class CampaignController {
  private logger = rootLogger.child({ logger: CampaignController.name });

  constructor(
    private donorService: DonorService,
    private campaignService: CampaignService,
  ) {}

  @ApiOperation({ summary: 'Set Favorite' })
  @ApiResponse({
    status: 201,
    description: 'The donor favorite campaign has been successfully set.',
  })
  @Post('setFavorite')
  async setFavorite(@Body() campaignSetFavoriteDto: CampaignSetFavoriteDto) {
    this.logger.debug('set favorite ', JSON.stringify(campaignSetFavoriteDto));
    return await this.donorService.setFavoriteCampaign(campaignSetFavoriteDto);
  }

  @ApiOperation({ summary: 'set flag to delete campaign' })
  @ApiResponse({
    status: 201,
    description: 'The New Campaign has been successfully flagged as deleted.',
  })
  @Post('setDeletedFlagBatch')
  async setDeletedFlag(
    @Body() request: CampaignSetDeletedFlagDto,
  ): Promise<BaseResponse<string>> {
    const affectedDeleteStatus = await this.campaignService.setDeletedFlag(
      request.campaignIds,
    );
    const response = baseResponseHelper(
      HttpStatus.OK,
      'Campaigns deleted',
      affectedDeleteStatus,
    );
    return response;
  }

  @ApiOperation({ summary: 'Get list all campaign' })
  @ApiResponse({
    status: 200,
    description: 'List all campaigns by organization ID.',
  })
  @Get('getListAll')
  async findAll(
    @Query('organizationId') organizationId: string,
    @Query('isFinished') isFinished: string,
    @Query('sortPublished') sortPublished: string,
    @Query('sortFinished') sortFinished: string,
  ) {
    this.logger.debug('findAll...');
    return await this.campaignService.findAll(
      organizationId,
      isFinished,
      sortPublished,
      sortFinished,
    );
  }

  @ApiOperation({ summary: 'List all campaigns by organization ID' })
  @Get('organization/:organizationId/getListAll')
  async getAllByOrganizationId(
    @Param('organizationId') organizationId: string,
  ) {
    this.logger.debug(`Get list all campaign by organization ID`);
    return await this.campaignService.getAllByOrganizationId(organizationId);
  }

  @ApiOperation({ summary: 'Get list all campaign by operatorID' })
  @Get('organization/:organizationId/operator/:operatorId/getListAll')
  async getAllByOperatorId(
    @Param('organizationId') organizationId: string,
    @Param('operatorId') operatorId: string,
  ) {
    this.logger.debug(`Get list all campaign by operator ID`);
    return await this.campaignService.getAllByOperatorId(
      organizationId,
      operatorId,
    );
  }

  @ApiOperation({
    summary: 'Get list all new campaign created by all operator',
  })
  @Get('organization/:organizationId/getListAllNew')
  async getAllNewCampaign(@Param('organizationId') organizationId: string) {
    this.logger.debug(`Get list all new campaign created by all operator`);
    return await this.campaignService.getAllNewCampaign(organizationId);
  }

  @ApiOperation({
    summary:
      'Get Detail of Unapproval Campaign Info Created by Manager by CampaignId ',
  })
  @Get('organization/:organizationId/unapproval/:campaignId')
  async getNewCampaignById(
    @Param('organizationId') organizationId: string,
    @Param('campaignId') campaignId: string,
  ) {
    this.logger.debug(
      `Get Detail of Unapproval Campaign Info Created by Manager by CampaignId`,
    );
    return await this.campaignService.getUnapprovalCampaignById(
      organizationId,
      campaignId,
    );
  }

  @ApiOperation({ summary: 'Get list all my approved campaign (vendor)' })
  @Get('organization/:organizationId/vendor/:vendorId/getListApproved')
  async getApprovedMyCampaignByVendor(
    @Param('organizationId') organizationId: string,
    @Param('vendorId') vendorId: string,
  ) {
    this.logger.debug(`Get list all my approved  campaign`);
    return await this.campaignService.getAllApprovedCampaign(
      organizationId,
      vendorId,
    );
  }

  @ApiOperation({ summary: 'Get list all my pending campaign (vendor)' })
  @Get('organization/:organizationId/vendor/:vendorId/getListPending')
  async getPendingMyCampaignByVendorId(
    @Param('organizationId') organizationId: string,
    @Param('vendorId') vendorId: string,
  ) {
    this.logger.debug(`Get list all my pending campaign`);
    return await this.campaignService.getAllPendingCampaignByVendorId(
      organizationId,
      vendorId,
    );
  }

  @ApiOperation({ summary: 'Get list all my pending campaign (Operator)' })
  @Get('organization/:organizationId/operator/:operatorId/getListPending')
  async getPendingMyCampaignByOperatorId(
    @Param('organizationId') organizationId: string,
    @Param('operatorId') operatorId: string,
  ) {
    this.logger.debug(`Get list all my pending campaign`);
    return await this.campaignService.getAllPendingCampaignByOperatorId(
      organizationId,
      operatorId,
    );
  }

  @ApiOperation({ summary: 'Create campaign' })
  @ApiResponse({
    status: 201,
    description: 'The Campaign has been successfully created.',
  })
  @ClusterRoles(RoleEnum.OPERATOR)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    this.logger.debug(
      'create new campaign ',
      JSON.stringify(createCampaignDto),
    );
    return await this.campaignService.create(createCampaignDto);
  }

  @ApiOperation({ summary: 'Vendor submit amd apply for campaign' })
  @ApiResponse({
    status: 201,
    description: 'The Campaign has been successfully applied by Vendor.',
  })
  @Post('vendor/apply')
  async vendorApply(@Body() createCampaignDto: CreateCampaignDto) {
    this.logger.debug(
      'apply to unapproved new campaign ',
      JSON.stringify(createCampaignDto),
    );
    return await this.campaignService.vendorApply(createCampaignDto);
  }

  @ApiOperation({ summary: 'create new campaign objectId' })
  @ApiResponse({
    status: 201,
    description: 'The New Campaign has been successfully created.',
  })
  @Post('getNewObjectId')
  async getNewCampaignObjectId(@Body() createCampaignDto: CreateCampaignDto) {
    this.logger.debug('get ObjectId ');
    return await this.campaignService.getObjectId(createCampaignDto);
  }

  @ApiOperation({ summary: 'update campaign' })
  @ClusterRoles(RoleEnum.OPERATOR)
  @UseGuards(JwtAuthGuard)
  @Patch('update/:campaignId')
  async updateCampaign(
    @Param('campaignId') campaignId: string,
    @Body() updateCampaignRequest: UpdateCampaignDto,
  ): Promise<BaseResponse<Campaign>> {
    this.logger.debug('payload', JSON.stringify(updateCampaignRequest));
    const updatedCampaign = await this.campaignService.updateCampaign(
      campaignId,
      updateCampaignRequest,
    );
    const response = baseResponseHelper(
      HttpStatus.OK,
      'Campaign updated',
      updatedCampaign,
    );
    return response;
  }
}
