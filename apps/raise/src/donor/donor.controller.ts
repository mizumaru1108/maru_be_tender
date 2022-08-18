import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Vendor } from '../buying/vendor/vendor.schema';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { rootLogger } from '../logger';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { DonorService } from './donor.service';
import { DonorPaymentSubmitDto, DonorUpdateProfileDto } from './dto';
import { DonorApplyVendorDto } from './dto/donor-apply-vendor.dto';

@ApiTags('donor')
@Controller('donor')
export class DonorController {
  private logger = rootLogger.child({ logger: DonorController.name });

  constructor(private donorService: DonorService) {}

  /**
   * Endpoint for donor to apply as vendor.
   * @param applyVendorRequest
   * @returns {Promise<Response<BaseResponse<Vendor>>>}
   */
  @ApiOperation({ summary: 'Apply to become vendor from donor.' })
  @UseGuards(JwtAuthGuard)
  @Post('/apply-vendor')
  async applyVendor(
    @Body() applyVendorRequest: DonorApplyVendorDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<BaseResponse<Vendor>> {
    this.logger.debug('apply to become vendor');
    const createdVendor = await this.donorService.applyVendor(
      currentUser.id,
      applyVendorRequest,
    );
    const response = baseResponseHelper(
      HttpStatus.CREATED,
      'Donor successfully applied to become vendor',
      createdVendor,
    );
    return response;
  }

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
  @UseGuards(JwtAuthGuard)
  async getDonorListAll(@Param('organizationId') organizationId: string) {
    this.logger.debug('findOne...');
    return await this.donorService.getDonorListAll(organizationId);
  }

  @ApiOperation({ summary: 'Create Donor Payment' })
  @Get('totalDonation/:donorId')
  async getTotalDonation(
    @Param('donorId') donorId: string,
    @Query('currencyCode') currency: string,
  ) {
    this.logger.debug('get TotalDonation');
    return await this.donorService.getTotalDonation(donorId, currency);
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

  @ApiOperation({ summary: 'Get Donation Donor Summary Dashboard' })
  @Get('totalDonationDonor/:donorId')
  async getTotalDonationDonor(
    @Param('donorId') donorId: string,
    @Query('currencyCode') currency: string,
  ) {
    this.logger.debug('get TotalDonationDonor');
    return await this.donorService.getTotalDonationDonor(donorId, currency);
  }
}
