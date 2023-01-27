import { Controller } from '@nestjs/common';
import { TenderFileManagerService } from '../services/tender-file-manager.service';

@Controller('tender-file-manager')
export class TenderFileManagerController {
  constructor(
    private readonly tenderFileManagerService: TenderFileManagerService,
  ) {}
}
