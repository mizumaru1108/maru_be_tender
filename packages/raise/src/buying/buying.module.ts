import { Module } from '@nestjs/common';
// import { OrgsService } from './orgs.service';
// import { OrgsController } from './orgs.controller';
import { VendorController } from './vendor/vendor.controller';
import { VendorService } from './vendor/vendor.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CampaignVendorLog,
  CampaignVendorLogSchema,
  Vendor,
  VendorChartData,
  VendorChartDataSchema,
  VendorSchema,
} from './vendor/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vendor.name,
        schema: VendorSchema,
      },
      {
        name: VendorChartData.name,
        schema: VendorChartDataSchema,
      },
      {
        name: CampaignVendorLog.name,
        schema: CampaignVendorLogSchema,
      },
    ]),
  ],
  providers: [VendorService],
  controllers: [VendorController],
})
export class BuyingModule {}
