import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CampaignVendorLog } from '../../buying/vendor/vendor.schema';

export class ApproveCampaignResponseDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CampaignVendorLog)
  approvedCampaign: CampaignVendorLog;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CampaignVendorLog)
  rejectedCampaign: CampaignVendorLog[];

  @ApiProperty()
  totalRejected: number;
}
