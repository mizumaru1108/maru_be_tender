import { Controller } from '@nestjs/common';
import { TenderAuthService } from '../services/tender-auth.service';

@Controller('tender-auth')
export class TenderAuthController {
  constructor(private readonly tenderAuthService: TenderAuthService) {}
}
