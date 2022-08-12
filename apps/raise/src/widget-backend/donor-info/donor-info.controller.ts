import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonorInfoService } from './donor-info.service';
import { CreateDonorInfoDto } from './dto/create-donor-info.dto';

@Controller('donor-info')
export class DonorInfoController {
  constructor(private readonly donorInfoService: DonorInfoService) {}

  @Post()
  create(@Body() createDonorInfoDto: CreateDonorInfoDto) {
    return this.donorInfoService.create(createDonorInfoDto);
  }

  @Get()
  findAll() {
    return this.donorInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donorInfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonorInfoDto: CreateDonorInfoDto) {
    return this.donorInfoService.update(+id, updateDonorInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donorInfoService.remove(+id);
  }
}
