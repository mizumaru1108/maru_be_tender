import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class BaseNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  notificationId: string;
}
