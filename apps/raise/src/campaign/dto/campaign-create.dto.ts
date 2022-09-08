import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsIn, IsUUID } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';
import { PayloadImage } from '../../commons/dtos/payload-image.dto';
import { CampaignMilestoneDto } from './campaign-milestone.dto';

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
  @IsIn(['Y', 'N'])
  isMoney: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
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

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // coverImage: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // image1: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // image2: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // image3: string;

  @ApiProperty()
  @IsArray()
  images: PayloadImage[];

  @ApiProperty()
  @IsArray()
  milestone: CampaignMilestoneDto[];
}
