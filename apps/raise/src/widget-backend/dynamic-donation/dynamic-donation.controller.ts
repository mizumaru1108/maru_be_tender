import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DynamicDonationService } from './dynamic-donation.service';
import { CreateDynamicDonationDto } from './dto/create-dynamic-donation.dto';
import { UpdateDynamicDonationDto } from './dto/update-dynamic-donation.dto';

@Controller('dynamic-donation')
export class DynamicDonationController {
  constructor(private readonly dynamicDonationService: DynamicDonationService) {}

  @Post()
  create(@Body() createDynamicDonationDto: CreateDynamicDonationDto) {
    return this.dynamicDonationService.create(createDynamicDonationDto);
  }

  @Get()
  findAll() {
    return this.dynamicDonationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicDonationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDynamicDonationDto: UpdateDynamicDonationDto) {
    return this.dynamicDonationService.update(+id, updateDynamicDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicDonationService.remove(+id);
  }
}
