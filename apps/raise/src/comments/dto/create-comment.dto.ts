import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;

  /**
   * Add it if you want this comment to be a reply to another comment
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  parentCommentId?: string;

  /**
   * Add it if you want comment to campaign.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  campaignId?: string;

  /**
   * Add it if you want comment to project.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  projectId?: string;

  /**
   * Add it if you want to comment to item.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  itemId?: string;

  /**
   * Content of the item
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
