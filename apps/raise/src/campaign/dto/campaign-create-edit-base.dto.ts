import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';
import { CreateMilestoneDto } from './create-milestone.dto';

/**
 * Same dto applied for create and edit
 */
export class CampaignCreateEditBaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  projectId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  campaignName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  campaignType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Y', 'N'], { message: 'isMoney must be Y or N' })
  isMoney: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  methods: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  currencyCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  amountTarget?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  isPublished?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMilestoneDto)
  milestone: CreateMilestoneDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  creatorUserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  islamCharityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  marketingPlanEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  marketingPlan?: string;
}
