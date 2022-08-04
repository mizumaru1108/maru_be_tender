import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  applicationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
