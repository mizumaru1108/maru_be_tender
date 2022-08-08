import {
  Query,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { rootLogger } from '../logger';
import { BasketProjectDto, BasketDto } from './dto';
import { WidgetsService } from './widgets.service';

@Controller('widgets')
export class WidgetsController {
  private logger = rootLogger.child({ logger: WidgetsController.name });

  constructor(private widgetsService: WidgetsService) { }

  @Get('basket/list')
  async getBasketList(@Query('donorId') donorId: string) {
    this.logger.debug('fetching basket list...');
    return await this.widgetsService.getBasketList(donorId);
  }

  @Post('basket/create')
  async createBasket(@Body() basketDto: BasketDto) {
    return await this.widgetsService.createBasket(basketDto);
  }

  @Patch('basket/:basketId')
  async updateBasket(
    @Param('basketId') basketId: string,
    @Body() basketDto: BasketDto,
  ) {
    this.logger.debug('update basket...');
    return await this.widgetsService.updateBasket(basketId, basketDto);
  }

  // @Post('basketProject/create')
  // async createBasketProject(@Body() basketProjectDto: BasketProjectDto) {
  //   return await this.widgetsService.createProjectBasket(basketProjectDto);
  // }

  // @Patch('basketProject/:basketId')
  // async updateProjectBasket(
  //   @Param('basketId') basketId: string,
  //   @Body() basketProjectDto: BasketProjectDto,
  // ) {
  //   this.logger.debug('update basket...');
  //   return await this.widgetsService.updateProjectBasket(basketId, basketProjectDto);
  // }

  // @Get('basketProject/list')
  // async getBasketProjectList(@Query('donorId') donorId: string) {
  //   this.logger.debug('fetching basket list...');
  //   return await this.widgetsService.getBasketProjectList(donorId);
  // }

}
