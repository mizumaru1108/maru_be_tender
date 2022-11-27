import { Controller, Get, Post } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ROOT_LOGGER } from '../libs/root-logger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('referral')
@Controller('referral')
export class ReferralController {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ReferralController.name,
  });

  constructor(private referralService: ReferralService) {}

  //referralGetListAll
  @Get('/getListAll')
  async findAll() {
    this.logger.debug('findAll...');
    return await this.referralService.findAll();
  }

  //referralGetSummary
  @Get('/getSummary')
  async getSummary() {
    return { message: 'Hello World !' };
  }

  //referralGetTopFiveByProjectByZone
  @Get('/getTopFiveByProjectByZone')
  async getTopFiveByProjectByZone() {
    return { message: 'Hello World !' };
  }
}
