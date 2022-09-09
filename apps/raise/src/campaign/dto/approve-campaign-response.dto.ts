import { ApiProperty } from '@nestjs/swagger';
import { CampaignVendorLog } from '../../buying/vendor/vendor.schema';

export class ApproveCampaignResponseDto {
  @ApiProperty()
  approvedCampaign: CampaignVendorLog;

  @ApiProperty()
  rejectedCampaign: CampaignVendorLog[];

  @ApiProperty()
  totalRejected: number;
}
