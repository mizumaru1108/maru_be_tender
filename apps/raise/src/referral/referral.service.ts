import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ROOT_LOGGER } from '../libs/root-logger';
import { Referral, ReferralDocument } from './referral.schema';

@Injectable()
export class ReferralService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ReferralService.name,
  });

  constructor(
    @InjectModel(Referral.name)
    private referralModel: Model<ReferralDocument>,
  ) {}

  async findAll() {
    this.logger.debug('findAll...');
    return await this.referralModel.find({}, {}, { sort: { name: 1 } });
  }
}
