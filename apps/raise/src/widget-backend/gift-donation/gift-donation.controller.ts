import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GiftDonationService } from './gift-donation.service';
import { CreateGiftDonationDto } from './dto/create-gift-donation.dto';

@Controller('gift-donation')
export class GiftDonationController {
  constructor(private readonly giftDonationService: GiftDonationService) {}

  @Post()
  create(@Body() createGiftDonationDto: CreateGiftDonationDto) {
    return this.giftDonationService.create(createGiftDonationDto);
  }

  @Get()
  findAll() {
    return this.giftDonationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftDonationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGiftDonationDto: CreateGiftDonationDto) {
    return this.giftDonationService.update(+id, updateGiftDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftDonationService.remove(+id);
  }
}
