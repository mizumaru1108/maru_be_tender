import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class UpdatePaymentNotifMapperResponse {
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
  reviewerId?: string;
  @ApiPropertyOptional()
  reviewerEmail?: string;
  @ApiPropertyOptional()
  reviewerMobileNumber?: string;
  @ApiPropertyOptional()
  reviewerContent?: string;
}
