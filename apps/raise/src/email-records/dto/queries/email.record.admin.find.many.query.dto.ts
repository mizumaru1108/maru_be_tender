import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ClientEmailRecordFindManyQueryDto } from './email.record.client.find.many.query.dto';

export class AdminEmailRecordFindManyQueryDto extends ClientEmailRecordFindManyQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sender_id?: string;
}
