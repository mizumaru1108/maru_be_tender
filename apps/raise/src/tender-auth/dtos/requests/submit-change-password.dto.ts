import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubmitChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  changePasswordId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  oldPassword?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
