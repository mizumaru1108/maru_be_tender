import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';

export class GetAllMypendingCampaignFromVendorIdRequest extends BaseFilterRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;
}
