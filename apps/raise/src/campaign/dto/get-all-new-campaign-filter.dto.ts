import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';
import { BaseBooleanString } from '../../commons/enums/base-boolean-string.enum';
import { BooleanString } from '../../commons/enums/boolean-string.enum';
import { CampaignSortByEnum } from '../enums/campaign-sortby-enum';
import { CampaignType } from '../enums/campaign-type.enum';

export class GetAllNewCampaignFilter extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(CampaignType)
  type: CampaignType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BaseBooleanString)
  isFinished: BooleanString;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(CampaignSortByEnum)
  sortBy: CampaignSortByEnum;
}
