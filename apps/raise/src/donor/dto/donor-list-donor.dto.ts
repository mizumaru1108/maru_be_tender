import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseFilterRequest } from "src/commons/dtos/base-filter-request.dto";

export class DonorListDto extends BaseFilterRequest {

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  type: string;

}