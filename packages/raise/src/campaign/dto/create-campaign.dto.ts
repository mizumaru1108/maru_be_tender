import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty()
  readonly organizationId: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly projectId: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly isMoney: string;

  @ApiProperty()
  readonly methods: string;

  @ApiProperty()
  readonly currencyCode: string;

  @ApiProperty()
  readonly amountProgress: string;

  @ApiProperty()
  readonly amountTarget: string;

  @ApiProperty()
  readonly coverImage: string;

  @ApiProperty()
  readonly image1: string;

  @ApiProperty()
  readonly image2: string;

  @ApiProperty()
  readonly image3: string;
}
