import { Body, Controller, Post } from '@nestjs/common';
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
}
