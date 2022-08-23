import { IsString, IsNotEmpty } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';

export class GetAllMypendingCampaignFromVendorIdRequest extends BaseFilterRequest {
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  organizationId: string;
}
