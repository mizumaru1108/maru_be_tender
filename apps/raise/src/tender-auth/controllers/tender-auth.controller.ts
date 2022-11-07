import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';
import { TenderAuthService } from '../services/tender-auth.service';

@Controller('tender-auth')
export class TenderAuthController {
  constructor(private readonly tenderAuthService: TenderAuthService) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterTenderDto) {
    const createdClient = await this.tenderAuthService.register(
      registerRequest,
    );
    return baseResponseHelper(
      createdClient,
      HttpStatus.CREATED,
      'Client has been registered successfully!',
    );
  }
}
