import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto';
import { Ticket, TicketDocument } from './ticket.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { ROOT_LOGGER } from '../libs/root-logger';

@Injectable()
export class TicketService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TicketService.name,
  });

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

  async getListAll() {
    this.logger.debug('Get ticket list ...');
    const data = await this.ticketModel.aggregate([
      {
        $lookup: {
          from: 'ticketLog',
          localField: 'ticketId',
          foreignField: 'ticketId',
          as: 'ticketLog',
        },
      },
      {
        $unwind: {
          path: '$ticketLog',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          department: { $first: '$department' },
          updatedAt: { $first: '$ticketLog.updatedAt' },
          status: { $first: '$ticketLog.status' },
        },
      },
    ]);
    // const data = [
    //             {
    //               "id": 123
    //           },
    //           {
    //             "id": 124
    //           },
    //           {
    //             "id": 125
    //           }];

    return data;
  }
}
