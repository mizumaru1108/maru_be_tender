import { Body, Controller, Post } from '@nestjs/common';
import { rootLogger } from '../logger';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTicketDto } from './dto';
import { TicketService } from './ticket.service';

@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
  private logger = rootLogger.child({ logger: TicketController.name });

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
}
