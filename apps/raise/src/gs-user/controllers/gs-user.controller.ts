import { Controller } from '@nestjs/common';
import { GsUserService } from '../services/gs-user.service';

@Controller('gs-user')
export class GsUserController {
  constructor(private readonly gsUserService: GsUserService) {}
}
