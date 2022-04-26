import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './ticket.schema';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
  ],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
