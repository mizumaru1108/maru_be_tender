import { Body, Controller, Post, Get } from '@nestjs/common';
import { ROOT_LOGGER } from '../libs/root-logger';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTicketDto } from './dto';
import { TicketService } from './ticket.service';

@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TicketController.name,
  });

  constructor(private ticketService: TicketService) {}

  @ApiOperation({ summary: 'Create Ticket' })
  @ApiResponse({
    status: 201,
    description: 'The Ticket has been successfully created.',
  })
  @Post('create')
  async create(@Body() createTicketDto: CreateTicketDto) {
    this.logger.debug('create new ticket ', JSON.stringify(createTicketDto));
    return await this.ticketService.create(createTicketDto);
  }

  @ApiOperation({ summary: 'Get All Ticket with its status' })
  @Get('getListAll')
  async getAllTickets() {
    this.logger.debug(`Get all tickets`);
    return await this.ticketService.getListAll();
  }
}
