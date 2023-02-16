import { Types } from 'mongoose';
import { CreateQuickDonationDto } from './donate.dto.type';

export class CreateWidgetBackendDto {
  readonly id: string;
  donorPhone?: string;
  receiverPhone?: string;
  donorName?: string;
  donorEmail: string;
  quickDonates: Array<CreateQuickDonationDto>;
}
