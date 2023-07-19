import { Types } from 'mongoose';
import { CreateQuickDonationDto } from './donate.dto.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWidgetBackendDto {
  readonly id: string;
  donorPhone?: string;
  receiverPhone?: string;
  donorName?: string;
  donorEmail: string;
  @ApiProperty({ type: () => CreateQuickDonationDto })
  quickDonates: Array<CreateQuickDonationDto>;
}
