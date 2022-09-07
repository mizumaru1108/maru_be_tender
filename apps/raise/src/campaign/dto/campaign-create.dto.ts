import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';

export class CampaignCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  projectId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  campaignName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  campaignType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isMoney: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  methods: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currencyCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  amountProgress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  amountTarget: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coverImage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image1: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image2: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image3: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  milestone: string;
}
