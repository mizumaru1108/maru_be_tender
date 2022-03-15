import { Controller, Get } from '@nestjs/common';
import { CoreService, ResponseWrapper } from './core.service';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}
}
