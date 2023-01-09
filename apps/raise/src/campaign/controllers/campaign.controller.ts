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
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

import { CampaignVendorLog } from '../../buying/vendor/vendor.schema';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';

import { BaseResponse } from '../../commons/dtos/base-response';
import { PaginatedResponse } from '../../commons/dtos/paginated-response.dto';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { paginationHelper } from '../../commons/helpers/pagination-helper';
import { DonorService } from '../../donor/donor.service';
import { Permission } from '../../libs/authzed/enums/permission.enum';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { CampaignApplyVendorDto } from '../dto/apply-vendor.dto';
import { ApproveCampaignResponseDto } from '../dto/approve-campaign-response.dto';
import { CampaignCreateResponse } from '../dto/campaign-create-response.dto';
import { CampaignCreateDto } from '../dto/campaign-create.dto';
import { CampaignDonorOnOperatorDasboardFilter } from '../dto/campaign-donor-on-operator-dashboard-filter.dto';
import { CampaignDonorOnOperatorDasboardParam } from '../dto/campaign-donor-on-operator-dashboard-param.dto';
import { CampaignUpdateDto } from '../dto/campaign-update.dto';
import { CampaignSetDeletedFlagDto } from '../dto/capaign-set-flag-deleted';
import { CampaignGetAllVendorRequestDto } from '../dto/campaign-get-all-vendor-request.dto';
import { GetAllNewCampaignFilter } from '../dto/get-all-new-campaign-filter.dto';
import { GetAllNewCampaignParams } from '../dto/get-all-new-campaign-params.dto';
import { UpdateCampaignStatusDto } from '../dto/update-campaign-status.dto';
import { Campaign, CampaignDocument } from '../schema/campaign.schema';
import { CampaignService } from '../services/campaign.service';
import { GetAllMyCampaignFilterDto } from '../dto/get-all-my-campaign.dto';
import { CampaignSetFavoriteDto } from '../dto/campaign-set-favorite.dto';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { Permissions } from '../../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';

@ApiTags('campaign')
@Controller('campaign')
export class CampaignController {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': CampaignController.name,
  });

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
      affectedDeleteStatus,
      HttpStatus.OK,
      'Campaigns deleted',
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

  /**
   * Story (Operator > Campaign Vendor Request)
   * Ref: https://www.notion.so/hendyirawan/Operator-Campaign-Vendor-Request-d33e785f1bf54b2da37e8d71c2eef984
   * Data Displayed by Frontend (response)
   * Vendor Name, Total Campaigns Done Before.
   */
  @ApiOperation({
    summary: 'Get all pending campaign vendor request (operator/admin)',
  })
  @ApiResponse({
    status: 200,
    description: `Successfully fetch all campaign vendor request on 'campaignId'`,
  })
  @Permissions(Permission.OE)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('getAllCampaignVendorRequest')
  async getAllCampaignVendorRequest(
    @Query() request: CampaignGetAllVendorRequestDto,
  ): Promise<PaginatedResponse<CampaignDocument[]>> {
    this.logger.debug(
      `Get all pending campaign vendor request from ${request.campaignId}`,
    );
    const campaignList = await this.campaignService.getAllCampaignVendorRequest(
      request,
    );
    const response = paginationHelper(
      campaignList.docs,
      campaignList.totalDocs,
      campaignList.limit,
      campaignList.page,
      campaignList.totalPages,
      campaignList.pagingCounter,
      campaignList.hasPrevPage,
      campaignList.hasNextPage,
      campaignList.prevPage,
      campaignList.nextPage,
      HttpStatus.OK,
      `Successfully fetch all campaign vendor request on '${request.campaignId}'`,
    );
    return response;
  }

  /**
   *
   */
  @ApiOperation({
    summary: 'Get all my campaign (operator/admin)',
  })
  @ApiResponse({
    status: 200,
    description: `Successfully fetch all campaign on user 'userId'`,
  })
  @Permissions(Permission.OE)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('getAllMyCampaign')
  async getAllMyCampaign(
    @CurrentUser() user: ICurrentUser,
    @Query() request: GetAllMyCampaignFilterDto,
  ): Promise<PaginatedResponse<CampaignDocument[]>> {
    this.logger.debug(
      `Get all pending campaign vendor request from ${user.id}`,
    );
    const campaignList = await this.campaignService.getAllMyCampaign(
      user.id,
      request,
    );
    const response = paginationHelper(
      campaignList.docs,
      campaignList.totalDocs,
      campaignList.limit,
      campaignList.page,
      campaignList.totalPages,
      campaignList.pagingCounter,
      campaignList.hasPrevPage,
      campaignList.hasNextPage,
      campaignList.prevPage,
      campaignList.nextPage,
      HttpStatus.OK,
      `Successfully fetch all campaign on user '${user.id}'`,
    );
    return response;
  }

  /**
   *
   */
  @ApiOperation({
    summary: 'Get all my campaign (organizationId)',
  })
  @ApiResponse({
    status: 200,
    description: `Successfully fetch all campaign`,
  })
  @Get('findAllCampaigns')
  async getCampaignsByOrganizationId(
    @Param('orgzanizationId') organizationId: string,
    @Query() request: GetAllMyCampaignFilterDto,
  ): Promise<PaginatedResponse<CampaignDocument[]>> {
    const campaignList =
      await this.campaignService.getCampaignsByOrganizationId(
        organizationId,
        request,
      );

    const response = paginationHelper(
      campaignList.docs,
      campaignList.totalDocs,
      campaignList.limit,
      campaignList.page,
      campaignList.totalPages,
      campaignList.pagingCounter,
      campaignList.hasPrevPage,
      campaignList.hasNextPage,
      campaignList.prevPage,
      campaignList.nextPage,
      HttpStatus.OK,
      `Successfully fetch all campaign on organizationId '${organizationId}'`,
    );
    return response;
  }

  /**
   * Story Campaign Donor on Operator Dashboard
   * Ref: https://www.notion.so/hendyirawan/Campaign-Donor-on-Operator-Dashboard-307544af9290495c85964371e72810c1
   */
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get list all donor on spesific campaign' })
  @Get('organization/:organizationId/:campaignId/donor-list')
  async getCampaignDonorListOnOperatorDashboard(
    @Param() param: CampaignDonorOnOperatorDasboardParam,
    @Query() filter: CampaignDonorOnOperatorDasboardFilter,
  ): Promise<PaginatedResponse<CampaignDocument[]>> {
    this.logger.debug(`Get list all donor on spesific campaign`);
    const donateList =
      await this.campaignService.getCampaignDonorListOnOperatorDashboard(
        param,
        filter,
      );
    const response = paginationHelper(
      donateList.docs,
      donateList.totalDocs,
      donateList.limit,
      donateList.page,
      donateList.totalPages,
      donateList.pagingCounter,
      donateList.hasPrevPage,
      donateList.hasNextPage,
      donateList.prevPage,
      donateList.nextPage,
      HttpStatus.OK,
      `Successfully get list of donor on camapaign ${param.campaignId}`,
    );
    return response;
  }

  @ApiOperation({ summary: 'List all campaigns by organization ID' })
  @Get('organization/:organizationId/getListAll')
  async getAllByOrganizationId(
    @Param('organizationId') organizationId: string,
  ) {
    this.logger.debug(`Get list all campaign by organization ID`);
    return await this.campaignService.getAllByOrganizationId(organizationId);
  }

  @ApiOperation({ summary: 'List all campaigns displayed in public page' })
  @Get('organization/:organizationId/getAllPublished')
  async getAllPublished(@Param('organizationId') organizationId: string) {
    this.logger.debug(`List all campaigns displayed in public page`);
    return await this.campaignService.getAllPublished(organizationId);
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

  /**
   * Simply refactor from getListAllNew (apply pagination and filter)
   */
  @ApiOperation({
    summary: 'Successfully get list of new campaign on organization',
  })
  @ApiResponse({
    status: 200,
    description: 'Get list of new campaign on organization.',
  })
  @Get('organization/:organizationId/getListAllNewPaginated')
  async getAllNewCampaignPaginated(
    @Param() params: GetAllNewCampaignParams,
    @Query() filter: GetAllNewCampaignFilter,
  ): Promise<PaginatedResponse<CampaignDocument[]>> {
    this.logger.debug(`Get list all new campaign created by all operator`);
    const newCampaigns = await this.campaignService.getAllNewCampaignPaginated(
      params.organizationId,
      filter,
    );
    const response = paginationHelper(
      newCampaigns.docs,
      newCampaigns.totalDocs,
      newCampaigns.limit,
      newCampaigns.page,
      newCampaigns.totalPages,
      newCampaigns.pagingCounter,
      newCampaigns.hasPrevPage,
      newCampaigns.hasNextPage,
      newCampaigns.prevPage,
      newCampaigns.nextPage,
      HttpStatus.OK,
      `Successfully get list of new campaign on organization ${params.organizationId}`,
    );
    return response;
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
  @Get(':campaignId/operator/:operatorId/getListPending')
  async getPendingMyCampaignByOperatorId(
    @Param('campaignId') campaignId: string,
    @Param('operatorId') operatorId: string,
  ) {
    this.logger.debug(`Get list all my pending campaign`);
    return await this.campaignService.getAllPendingCampaignByOperatorId(
      campaignId,
      operatorId,
    );
  }

  @ApiOperation({ summary: 'Create campaign' })
  @ApiResponse({
    status: 201,
    description: 'The Campaign has been successfully created.',
  })
  @Permissions(Permission.OE || Permission.NF)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('campaignCreate')
  async campaignCreate(
    @CurrentUser() user: ICurrentUser,
    @Body() request: CampaignCreateDto,
  ): Promise<BaseResponse<CampaignCreateResponse>> {
    this.logger.debug('create new campaign ', JSON.stringify(request));
    request.campaignName = request.title ? request.title : request.campaignName;
    const response = await this.campaignService.campaignCreate(
      user.id,
      request,
    );
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'The Campaign has been successfully created.',
    );
  }

  /**
   * Story Title: Vendor > Apply to campaign
   * Story URL: https://www.notion.so/hendyirawan/Vendor-Apply-to-campaign-548856c4d9a649479d57c0d9b29288d0
   * @param user Current user (get from guards)
   * @param request Request body
   * @returns {Promise<BaseResponse<CampaignVendorLog>>}
   */
  @ApiOperation({ summary: 'Vendor apply to campaign' })
  @ApiResponse({
    status: 201,
    description:
      'Current vendor has been applied to campaign `campaignId` successfully',
  })
  @Permissions(Permission.VE)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('vendor/apply')
  async vendorApply(
    @CurrentUser() user: ICurrentUser,
    @Body() request: CampaignApplyVendorDto,
  ): Promise<BaseResponse<CampaignVendorLog>> {
    this.logger.debug(
      'apply to unapproved new campaign ',
      JSON.stringify(request),
    );
    const response = await this.campaignService.vendorApply(user.id, request);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      `Current vendor has been applied to campaign ${request.campaignId} successfully`,
    );
  }

  /**
   * Story Title: Operator > approve campaign vendor request
   * Story Ref: https://www.notion.so/hendyirawan/Operator-Campaign-Vendor-Request-d33e785f1bf54b2da37e8d71c2eef984
   * @param user current user (get from guards)
   * @param request request body
   * @returns {Promise<BaseResponse<ApproveCampaignResponseDto>>}
   */
  @ApiOperation({ summary: 'Operator/Manager approve for vendor request' })
  @ApiResponse({
    status: 201,
    description: 'Campain vendor request has been approved successfully!',
  })
  @Permissions(Permission.OE) // can be accessed by operator / admin
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('operator/approve')
  async approveCampaign(
    @CurrentUser() user: ICurrentUser,
    @Body() request: UpdateCampaignStatusDto,
  ): Promise<BaseResponse<ApproveCampaignResponseDto>> {
    this.logger.debug(
      'apply to unapproved new campaign ',
      JSON.stringify(request),
    );
    const response = await this.campaignService.operatorApprove(
      request,
      user.id,
    );
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      `Campain vendor request has been approved successfully!`,
    );
  }

  @ApiOperation({ summary: 'Operator reject for campaign' })
  @ApiResponse({
    status: 201,
    description: 'Campaign `campaignId` has been rejected by Operator !',
  })
  @Permissions(Permission.OE)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post('operator/reject')
  async rejectCampaign(
    @Body() request: UpdateCampaignStatusDto,
  ): Promise<BaseResponse<CampaignVendorLog>> {
    this.logger.debug(
      'applying reject to unapproved new campaign ',
      JSON.stringify(request),
    );
    const rejectedCampaign = await this.campaignService.operatorReject(request);
    return baseResponseHelper(
      rejectedCampaign,
      HttpStatus.OK,
      `Campaign ${request.campaignId} has been rejected by Operator!`,
    );
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

  @ApiOperation({ summary: 'get a campaign detail by campaignId' })
  @ApiResponse({
    status: 200,
    description: 'Campaign `campaignId` details retrieved successfully!',
  })
  @Get('detail/:campaignId')
  async getCampaignDetailById(
    @Param('campaignId') campaignId: string,
  ): Promise<BaseResponse<Campaign>> {
    this.logger.debug(`get details of ${campaignId}`);
    const campaign = await this.campaignService.getCampaignDetailById(
      campaignId,
    );
    return baseResponseHelper(
      campaign,
      HttpStatus.OK,
      `Campaign ${campaignId} details retrieved successfully!`,
    );
  }

  @ApiOperation({ summary: 'update campaign' })
  @Permissions(Permission.OE)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('campaignUpdate/:campaignId')
  async campaignUpdate(
    @CurrentUser() user: ICurrentUser,
    @Param('campaignId') campaignId: string,
    @Body() updateCampaignRequest: CampaignUpdateDto,
  ): Promise<BaseResponse<Campaign>> {
    this.logger.debug('payload', JSON.stringify(updateCampaignRequest));
    const updatedCampaign = await this.campaignService.campaignUpdate(
      user.id,
      campaignId,
      updateCampaignRequest,
    );
    const response = baseResponseHelper(
      updatedCampaign,
      HttpStatus.OK,
      'Campaign updated',
    );
    return response;
  }
}
