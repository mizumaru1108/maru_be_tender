import { Controller, Body, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { rootLogger } from '../logger';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto';

@ApiTags('item')
@Controller('item')
export class ItemController {
  private logger = rootLogger.child({ logger: ItemController.name });
  constructor(private itemService: ItemService) {}

  @ApiOperation({ summary: 'Get All Items viewed by manager' })
  @Get('manager/getListAll')
  async getAllProjects() {
    this.logger.debug(`Get all items`);
    return await this.itemService.getListAll();
  }

  @ApiOperation({ summary: 'Get All Items viewed by operator' })
  @Get('manager/operator/:operatorId/getListAll')
  async getAllItemsByOperatorId(@Param('operatorId') operatorId: string) {
    this.logger.debug(`Get all items`);
    return await this.itemService.getListAllByOperatorId(operatorId);
  }

  @ApiOperation({ summary: 'Create item' })
  @ApiResponse({
    status: 201,
    description: 'The Item has been successfully created.',
  })
  @Post('create')
  async create(@Body() createItemDto: CreateItemDto) {
    this.logger.debug('create new project ', JSON.stringify(createItemDto));
    return await this.itemService.create(createItemDto);
  }
}
