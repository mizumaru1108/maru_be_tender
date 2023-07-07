import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';

export class CreateManyNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNotificationDto)
  payloads: CreateNotificationDto[];
}
