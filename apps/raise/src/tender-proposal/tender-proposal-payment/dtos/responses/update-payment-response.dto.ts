import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { cheque, payment, proposal_log } from '@prisma/client';

export class UpdatePaymentResponseDto {
  @ApiProperty()
  updatedPayment: payment;

  @ApiProperty()
  createdLogs: proposal_log;

  @ApiPropertyOptional()
  createdCheque?: cheque | null;
}
