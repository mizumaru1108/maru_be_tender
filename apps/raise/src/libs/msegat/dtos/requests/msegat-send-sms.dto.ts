import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class MsegatSendSmsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numbers: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userSender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  msg: string;

  /**
   * optional, string, now or later, if not defined = now
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['now', 'later'], { message: 'time to send must be now or later' })
  timeToSend?: 'now' | 'later';

  /**
   * (optional, string,datetime in format : yyyy-MM-dd HH:mm:ss , if not defined =now`)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  exactTime?: string;

  /* required, string, UTF8 or windows-1256 */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['UTF8', 'windows-1256'], {
    message: 'msgEncoding must be UTF8 or windows-1256',
  })
  msgEncoding?: 'UTF8' | 'windows-1256';

  /**
   * (optional, string, true or false, if not defined = false, when user need the msg id of the bulk, he must pass the variable with value = true)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reqBulkId?: string;

  /**
   * (optional, string, true or false, the system will filter the duplicated numbers, the default value is true`)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reqFilter?: string;
}
