import { Controller, Get } from '@nestjs/common';
import { CoreService, ResponseWrapper } from '../core.service';

@Controller()
export class RootController {
  constructor(private readonly coreService: CoreService) {}

  @Get()
  getHello(): ResponseWrapper {
    return this.coreService.getHello();
  }
}
