import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto';
import { Ticket, TicketDocument } from './ticket.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<TicketDocument>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(createTicketDto);
    createdTicket.ticketId = uuidv4();
    createdTicket.createdAt = moment().toISOString();
    createdTicket.updatedAt = moment().toISOString();
    return createdTicket.save();
  }
}
