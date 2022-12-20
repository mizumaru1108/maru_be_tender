import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UploadFilesJsonbDto } from '../../../../tender-commons/dto/upload-files-jsonb.dto';
import { MessageType } from '../../types';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['TEXT', 'IMAGE', 'VIDEO', 'VOICE_NOTE', 'FILE'], {
    message:
      'Content type must be either TEXT, IMAGE, VIDEO, VOICE_NOTE or FILE',
  })
  content_type_id: MessageType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['INTERNAL', 'EXTERNAL'], {
    message: 'Correspondance type must be either INTERNAL or EXTERNAL',
  })
  correspondence_type_id: 'INTERNAL' | 'EXTERNAL';

  /**
   * if content type is TEXT this field is required
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  /**
   * if content type is NOT TEXT this field will be required.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UploadFilesJsonbDto)
  attachment?: UploadFilesJsonbDto;

  /**
   * the title of the attachment.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content_title?: string;

  /**
   * refer to it's own table as replies.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  reply_id?: string;

  /**
   * id of the person that you want to send the message to.
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  partner_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  partner_selected_role: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  current_user_selected_role: string;
}
