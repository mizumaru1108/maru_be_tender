import { Controller, Post, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { MessageDto } from './message.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('/send')
  async sendEmail(@Body() message: MessageDto) {
    return await this.contactsService.sendMail(message);
  }
}
