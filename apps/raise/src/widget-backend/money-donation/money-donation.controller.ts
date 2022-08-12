import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoneyDonationService } from './money-donation.service';
import { CreateMoneyDonationDto } from './dto/create-money-donation.dto';

@Controller('money-donation')
export class MoneyDonationController {
  constructor(private readonly moneyDonationService: MoneyDonationService) {}

  @Post()
  create(@Body() createMoneyDonationDto: CreateMoneyDonationDto) {
    return this.moneyDonationService.create(createMoneyDonationDto);
  }

  @Get()
  findAll() {
    return this.moneyDonationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moneyDonationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMoneyDonationDto: CreateMoneyDonationDto) {
    return this.moneyDonationService.update(+id, updateMoneyDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moneyDonationService.remove(+id);
  }
}
