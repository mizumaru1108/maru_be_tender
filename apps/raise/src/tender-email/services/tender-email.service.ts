import { Injectable } from '@nestjs/common';
import { EmailService } from '../../libs/email/email.service';

@Injectable()
export class TenderEmailService {
  constructor(private readonly emailService: EmailService) {}

  async send() {}
}
