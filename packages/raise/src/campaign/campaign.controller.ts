import { Body, Controller, Get, Query, Post, Param } from '@nestjs/common';
import { rootLogger } from '../logger';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaignSetFavoriteDto, CreateCampaignDto } from './dto';
import { DonorService } from '../donor/donor.service';
import { CampaignService } from './campaign.service';

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

  @ApiOperation({ summary: 'Create Campaign' })
  @ApiResponse({
    status: 201,
    description: 'The Campaign has been successfully created.',
  })
  @Post('create')
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    this.logger.debug(
      'create new campaign ',
      JSON.stringify(createCampaignDto),
    );
    return await this.campaignService.create(createCampaignDto);
  }

  @Get('getListAll')
  async findAll(@Query('organizationId') organizationId: string) {
    this.logger.debug('findAll...');
    return await this.campaignService.findAll(organizationId);
    // return { message: 'hello' };
  }

  @ApiOperation({ summary: 'Get list all campaign by organizationID'})
  @Get('organization/:organizationId/getListAll')
  async getAllByOrganizationId(@Param('organizationId') organizationId: string){
    this.logger.debug(`Get list all campaign by organization ID`);
    return await this.campaignService.getAllByOrganizationId(organizationId);
  }


  @ApiOperation({ summary: 'Get list all campaign by operatorID'})
  @Get('operator/:operatorId/getListAll')
  async getAllByOperatorId(@Param('operatorId') operatorId: string){
    this.logger.debug(`Get list all campaign by operator ID`);
    return await this.campaignService.getAllByOperatorId(operatorId);
  }

  @ApiOperation({ summary: 'Get list all new campaign created by all operator'})
  @Get('organization/:organizationId/getListAllNew')
  async getAllNewCampaign(@Param('organizationId') organizationId: string){
    this.logger.debug(`Get list all new campaign created by all operator`);
    return await this.campaignService.getAllNewCampaign(organizationId);
  }


  @ApiOperation({ summary: 'Get list all my campaign (vendor)'})
  @Get('organization/:organizationId/vendor/:vendorId/getListAllApproved')
  async getAllMyCampaignByVendor(
    @Param('organizationId') organizationId: string,
    @Param('vendorId') vendorId: string
    ){
    this.logger.debug(`Get list all new campaign created by all operator`);
    return await this.campaignService.getAllApprovedCampaign(organizationId, vendorId);
  }

}
