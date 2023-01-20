import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ReadNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  notificationId: string;
}
