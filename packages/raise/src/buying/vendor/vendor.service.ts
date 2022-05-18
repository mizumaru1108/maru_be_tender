import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rootLogger } from '../../logger';
import { Vendor, VendorDocument } from './vendor.schema';

@Injectable()
export class VendorService {
  private logger = rootLogger.child({ logger: VendorService.name });

  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
  ) {}

  async findAll() {
    this.logger.debug('findAll...');
    return await this.vendorModel.find({}, {}, { sort: { name: 1 } });
  }
}
