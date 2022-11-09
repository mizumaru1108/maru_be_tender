import { Controller, HttpStatus, Post } from '@nestjs/common';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderEmailService } from '../services/tender-email.service';

@Controller('tender-email')
export class TenderEmailController {
  constructor(private readonly tenderEmailService: TenderEmailService) {}

  @Post('send')
  async send() {
    const createdRecord = await this.tenderEmailService.send();
    return baseResponseHelper(
      createdRecord,
      HttpStatus.CREATED,
      'Tender Email sent successfully',
    );
  }
}
