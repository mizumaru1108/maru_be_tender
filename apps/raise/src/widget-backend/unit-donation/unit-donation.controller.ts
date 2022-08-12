import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UnitDonationService } from './unit-donation.service';
import { CreateUnitDonationDto } from './dto/create-unit-donation.dto';

@Controller('unit-donation')
export class UnitDonationController {
  constructor(private readonly unitDonationService: UnitDonationService) {}

  @Post()
  create(@Body() createUnitDonationDto: CreateUnitDonationDto) {
    return this.unitDonationService.create(createUnitDonationDto);
  }

  @Get()
  findAll() {
    return this.unitDonationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitDonationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitDonationDto: CreateUnitDonationDto) {
    return this.unitDonationService.update(+id, updateUnitDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitDonationService.remove(+id);
  }
}
