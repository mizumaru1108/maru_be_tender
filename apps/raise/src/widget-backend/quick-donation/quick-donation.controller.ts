import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuickDonationService } from './quick-donation.service';
import { CreateQuickDonationDto } from './dto/create-quick-donation.dto';
import { UpdateQuickDonationDto } from './dto/update-quick-donation.dto';

@Controller('quick-donation')
export class QuickDonationController {
  constructor(private readonly quickDonationService: QuickDonationService) {}

  @Post()
  create(@Body() createQuickDonationDto: CreateQuickDonationDto) {
    return this.quickDonationService.create(createQuickDonationDto);
  }

  @Get()
  findAll() {
    return this.quickDonationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quickDonationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuickDonationDto: UpdateQuickDonationDto) {
    return this.quickDonationService.update(+id, updateQuickDonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quickDonationService.remove(+id);
  }
}
