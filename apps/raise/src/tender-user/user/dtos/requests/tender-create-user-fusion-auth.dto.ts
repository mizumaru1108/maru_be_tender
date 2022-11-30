import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class TenderCreateUserFusionAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  user_roles: string[];
}
