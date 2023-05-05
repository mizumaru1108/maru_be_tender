import { Controller, Post, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { MessageDto } from './message.dto';

import { HttpStatus } from '@nestjs/common';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('/send')
  async sendEmail(@Body() message: MessageDto) {
    const resContactSend = await this.contactsService.sendMail(message);

    return baseResponseHelper(
      resContactSend,
      HttpStatus.OK,
      'Your email has been sent',
    );
  }
}
