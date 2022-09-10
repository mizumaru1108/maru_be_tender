import { ApiProperty } from '@nestjs/swagger';
import { CampaignVendorLog } from '../../buying/vendor/vendor.schema';
import { Campaign } from '../schema/campaign.schema';

export class CampaignCreateResponse {
  @ApiProperty()
  createdCampaign: Campaign | null;
  @ApiProperty()
  createdCampaignVendorLog: CampaignVendorLog | null;
}
