import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProposalThirdStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pm_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pm_mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pm_email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  governorate: string;
}
