import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsEmail,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class MessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  help_message: string;

  @ApiPropertyOptional()
  @IsOptional()
  organizationId: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentFile)
  files?: AttachmentFile[];
}

export class AttachmentFile {
  filename: string;
  path: string;
}
