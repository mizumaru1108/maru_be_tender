import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { rootLogger } from '../logger';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DonorService } from './donor.service';
import { DonorPaymentSubmitDto, DonorUpdateProfileDto } from './dto';

@ApiTags('donor')
@Controller('donor')
export class DonorController {
  private logger = rootLogger.child({ logger: DonorController.name });

  constructor(private donorService: DonorService) {}

  @ApiOperation({ summary: 'Create Donor Payment' })
  @ApiResponse({
    status: 201,
    description: 'The Donor payment has been successfully created.',
  })
  @Post('payment/submit')
  async create(@Body() donorPaymentSubmitDto: DonorPaymentSubmitDto) {
    this.logger.debug(
      'create donor payment ',
      JSON.stringify(donorPaymentSubmitDto),
    );
    return await this.donorService.submitPayment(donorPaymentSubmitDto);
  }

  @Get(':donorId')
  async getDonor(@Param('donorId') donorId: string) {
    this.logger.debug('findOne...');
    return await this.donorService.getDonor(donorId);
  }

  @Patch(':donorId')
  async updateDonor(
    @Param('donorId') donorId: string,
    @Body() donorUpdateProfileDto: DonorUpdateProfileDto,
  ) {
    this.logger.debug('update donor');
    this.logger.debug(JSON.stringify(donorUpdateProfileDto));
    return await this.donorService.updateDonor(donorId, donorUpdateProfileDto);
  }
}
