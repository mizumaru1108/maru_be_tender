import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROOT_LOGGER } from '../libs/root-logger';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import { HrService } from './hr.service';
@ApiTags('hr')
@Controller('hr')
export class HrController {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': HrController.name,
  });
  constructor(private hrService: HrService) {}

  @ApiOperation({ summary: 'Create Hr Data' })
  @ApiResponse({
    status: 201,
    description: 'The Hr has been successfully created.',
  })
  @Post()
  async create(@Body() createRequest: CreateHrDto) {
    this.logger.debug('create hr ', JSON.stringify(createRequest));
    return await this.hrService.create(createRequest);
  }

  @ApiOperation({ summary: 'Get All Hr' })
  @Get()
  async getAllHr() {
    this.logger.debug(`Get all tickets`);
    return await this.hrService.getListAll();
  }

  @ApiOperation({ summary: 'Get hr by id' })
  @Get(':id')
  getById(@Param('id') id: string) {
    this.logger.debug(`Get By Hr by Id`);
    return this.hrService.getById(id);
  }

  @ApiOperation({ summary: 'update hr' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRequest: UpdateHrDto) {
    this.logger.debug('update hr ', JSON.stringify(updateRequest));
    return this.hrService.update(id, updateRequest);
  }

  @ApiOperation({ summary: 'Delete hr' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.debug(`Delete Hr by Id ${id}`);
    return this.hrService.delete(id);
  }
}
