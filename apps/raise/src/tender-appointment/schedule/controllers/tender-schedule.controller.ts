import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TenderScheduleService } from '../services/tender-schedule.service';

@Controller('tender-schedule')
export class TenderScheduleController {
  constructor(private readonly tenderScheduleService: TenderScheduleService) {}

  @Post()
  create() {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
