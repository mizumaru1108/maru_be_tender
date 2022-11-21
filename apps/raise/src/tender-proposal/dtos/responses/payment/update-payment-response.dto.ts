import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { cheque, payment } from '@prisma/client';

export class UpdatePaymentResponseDto {
  @ApiProperty()
  updatedPayment: payment;

  @ApiPropertyOptional()
  createdCheque?: cheque;
}
