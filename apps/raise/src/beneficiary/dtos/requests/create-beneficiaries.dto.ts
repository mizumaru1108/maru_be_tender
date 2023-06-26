import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBeneficiariesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
