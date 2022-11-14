import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Template } from 'handlebars';

export class EmailAttachment {
  @ApiProperty()
  @IsString()
  filename: string;

  @ApiPropertyOptional()
  @IsOptional()
  content?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  encoding?: string;

  @ApiPropertyOptional()
  @IsOptional()
  contentDisposition?: 'attachment' | 'inline' | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  href?: string;
}

export class SendEmailDto {
  /**
   * Send email to
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  to: string;

  /**
   * Mail type, is it with template or without template
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['plain', 'template'], {
    message: "mailType must be either 'plain' or 'template'",
  })
  mailType: 'plain' | 'template';

  /**
   * Required if mailType is "plain"
   * it will be the content is the email (html)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  /**
   * Subject of the email
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subject?: string;

  /**
   * CC (carbon copy) of the email
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cc?: string;

  /**
   * path of hbs template (required if the mailtype is "template")
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  templatePath?: string;

  /**
   * context passed to the template (required if the mailtype is "template")
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmptyObject()
  templateContext?: Record<string, any>;

  /**
   * email from (sender) (optional, default: "hello@tamra")
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  from?: string;

  /**
   * Email Attachments
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => EmailAttachment)
  @ValidateNested({ each: true })
  attachments?: EmailAttachment[];
}
