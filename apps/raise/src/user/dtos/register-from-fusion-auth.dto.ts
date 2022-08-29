import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsEmpty } from 'class-validator';

export class RegisterFromFusionAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  country?: string;
  
  @ApiProperty()
  state?: string;
  
  @ApiProperty()
  address?: string;
  
  @ApiProperty()
  mobile?: string;

}
