import { Module } from '@nestjs/common';
// import { OrgsService } from './orgs.service';
// import { OrgsController } from './orgs.controller';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Vendor,
  VendorSchema,
} from './vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vendor.name,
        schema: VendorSchema,
      },
    ]),
  ],
  providers: [ VendorService],
  controllers: [ VendorController],
})
export class VendorModule {}
