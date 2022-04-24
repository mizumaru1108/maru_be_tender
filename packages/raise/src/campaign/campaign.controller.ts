import { Body, Controller, Get, Post } from '@nestjs/common';
import { rootLogger } from '../logger';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaignSetFavoriteDto } from './dto';
import { DonorService } from '../donor/donor.service';

@ApiTags('campaign')
@Controller('campaign')
export class CampaignController {
  private logger = rootLogger.child({ logger: CampaignController.name });

  constructor(private donorService: DonorService) {}

  @ApiOperation({ summary: 'Set Favorite' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @Post('setFavorite')
  async setFavorite(@Body() campaignSetFavoriteDto: CampaignSetFavoriteDto) {
    return await this.donorService.setFavoriteCampaign(campaignSetFavoriteDto);
  }
}
