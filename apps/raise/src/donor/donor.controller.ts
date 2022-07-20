import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
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

  @Get('getDonationLogs')
  async getDonationLogs(
    @Query('donorUserId') donorUserId: string,
    @Query('sortDate') sortDate: string,
    @Query('sortStatus') sortStatus: string,
  ) {
    this.logger.debug('find donation logs by donor...');
    return await this.donorService.getDonationLogs(
      donorUserId,
      sortDate,
      sortStatus,
    );
  }

  @Get(':donorId')
  async getDonor(@Param('donorId') donorId: string) {
    this.logger.debug('findOne...');
    return await this.donorService.getDonor(donorId);
  }

  @Get('organization/:organizationId/manager/getListAll')
  async getDonorListAll(@Param('organizationId') organizationId: string) {
    this.logger.debug('findOne...');
    return await this.donorService.getDonorListAll(organizationId);
  }

  @Post('anonymous/create')
  async createDonor(@Body() donorProfileDto: DonorUpdateProfileDto) {
    this.logger.debug('create donor as anonymous user');
    this.logger.debug(JSON.stringify(donorProfileDto));
    return await this.donorService.addAnonymousDonor(donorProfileDto);
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
