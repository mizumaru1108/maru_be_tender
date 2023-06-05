import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsOptional,
} from 'class-validator';

export class SendEmailVerifDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsIn(['en', 'ar'])
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  selectLang?: 'en' | 'ar';
}
