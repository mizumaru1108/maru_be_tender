import { Controller } from '@nestjs/common';
import { TenderNotificationService } from '../services/tender-notification.service';

@Controller('tender/notification')
export class TenderNotificationController {
  constructor(
    private readonly tenderNotificationService: TenderNotificationService,
  ) {}
}
