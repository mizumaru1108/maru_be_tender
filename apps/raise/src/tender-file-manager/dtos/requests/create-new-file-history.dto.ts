import { ApiProperty } from '@nestjs/swagger';
import {
  IsMimeType,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateNewFileHistoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  @Max(999999999999999999.99)
  size: number;

  @ApiProperty()
  @IsMimeType()
  @IsString()
  mimetype: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsString()
  table_name: string;

  @ApiProperty()
  @IsString()
  coulumn_name: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  user_id: string;
}
