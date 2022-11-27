import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { ROOT_LOGGER } from '../libs/root-logger';
import { CreateItemDto } from './dto';
import { ItemSetDeletedFlagDto } from './dto/item-set-flag-deleted';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.schema';
import { ItemService } from './item.service';

@ApiTags('item')
@Controller('item')
export class ItemController {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ItemController.name,
  });
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
    this.logger.debug('create new item ', JSON.stringify(createItemDto));
    return await this.itemService.create(createItemDto);
  }

  @ApiOperation({ summary: 'set flag to delete campaign' })
  @ApiResponse({
    status: 201,
    description: 'The New Campaign has been successfully flagged as deleted.',
  })
  @Post('setDeletedFlagBatch')
  async setDeletedFlag(
    @Body() request: ItemSetDeletedFlagDto,
  ): Promise<BaseResponse<string>> {
    const affectedDeleteStatus = await this.itemService.setDeletedFlag(
      request.itemIds,
    );
    const response = baseResponseHelper(
      affectedDeleteStatus,
      HttpStatus.CREATED,
      'The Item has been successfully flagged as deleted.',
    );
    return response;
  }

  @ApiOperation({ summary: 'update project' })
  @Patch('update/:itemId')
  async updateProject(
    @Param('itemId') itemId: string,
    @Body() updateRequest: UpdateItemDto,
  ): Promise<BaseResponse<Item>> {
    this.logger.debug('payload', JSON.stringify(updateRequest));
    this.logger.debug(`update project ${itemId}`);
    const updatedItem = await this.itemService.updateItem(
      itemId,
      updateRequest,
    );
    const response = baseResponseHelper(
      updatedItem,
      HttpStatus.OK,
      'Item updated',
    );
    return response;
  }
}
