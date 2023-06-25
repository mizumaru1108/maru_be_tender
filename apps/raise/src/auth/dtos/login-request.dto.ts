import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  organizationId?: string;
}
