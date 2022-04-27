import { ApiProperty } from '@nestjs/swagger';
import { DonationType } from '../enum/donation-type.enum';

export class DonorPaymentSubmitDto {
  @ApiProperty()
  readonly organizationId: string;

  @ApiProperty()
  readonly projectId: string;

  @ApiProperty()
  readonly campaignId: string;

  @ApiProperty()
  readonly donorId: string;

  @ApiProperty()
  readonly itemId: string;

  @ApiProperty()
  readonly type: DonationType;

  @ApiProperty()
  readonly paymentGatewayId: string;

  @ApiProperty()
  readonly amount: number;

  @ApiProperty()
  readonly currency: string;

  @ApiProperty()
  readonly ipAddress: string;
}
