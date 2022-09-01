import { IsString } from "class-validator";
import { BaseFilterRequest } from "src/commons/dtos/base-filter-request.dto";


export class DonorsFilterDto extends BaseFilterRequest {
  @IsString()
  organizationId: string;
  donor?: string;
  transactionDate?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  amount?: string;
  donorName?: string;
}
