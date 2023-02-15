import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateNotificationDto } from '../../../../tender-notification/dtos/requests/create-notification.dto';

export class InsertPaymentNotifMapperResponse {
  @ApiProperty()
  logTime: string;
  @ApiProperty()
  subject: string;
  @ApiProperty()
  clientId: string;
  @ApiProperty()
  clientEmail: string;
  @ApiProperty()
  clientMobileNumber: string;
  @ApiProperty()
  clientContent: string;
  @ApiProperty()
  createManyWebNotifPayload: Prisma.notificationCreateManyInput[];
  @ApiPropertyOptional()
  supervisorId?: string;
  @ApiPropertyOptional()
  supervisorEmail?: string;
  @ApiPropertyOptional()
  supervisorMobileNumber?: string;
  @ApiPropertyOptional()
  supervisorContent?: string;
}
