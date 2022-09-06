import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/commons/dtos/paginated-response.dto';
import { paginationHelper } from 'src/commons/helpers/pagination-helper';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Vendor } from '../buying/vendor/vendor.schema';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { PaytabsIpnWebhookResponsePayload } from '../libs/paytabs/dtos/response/paytabs-ipn-webhook-response-payload.dto';
import { PaytabsService } from '../libs/paytabs/services/paytabs.service';
import { rootLogger } from '../logger';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { DonorService } from './donor.service';
import {
  DonorListDto,
  DonorListTrxDto,
  DonorPaymentSubmitDto,
  DonorUpdateProfileDto,
} from './dto';
import { DonorApplyVendorDto } from './dto/donor-apply-vendor.dto';
import { DonorDonateItemResponse } from './dto/donor-donate-item-response';
import { DonorDonateItemDto } from './dto/donor-donate-item.dto';
import { DonorDonateResponse } from './dto/donor-donate-response.dto';
import { DonorDonateDto } from './dto/donor-donate.dto';
import { DonationLogDocument as DonationLogsDocument } from './schema/donation_log.schema';
import { Donor } from './schema/donor.schema';

@ApiTags('donor')
@Controller('donor')
export class DonorController {
  private logger = rootLogger.child({ logger: DonorController.name });

  constructor(
    private donorService: DonorService,
    private paytabsService: PaytabsService,
  ) {}

  @Post('anonymous/create')
  async createDonor(@Body() donorProfileDto: DonorUpdateProfileDto) {
    this.logger.debug('create donor as anonymous user');
    this.logger.debug(JSON.stringify(donorProfileDto));
    return await this.donorService.addAnonymousDonor(donorProfileDto);
  }

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
      createdVendor,
      HttpStatus.CREATED,
      'Donor successfully applied to become vendor',
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

  @ApiOperation({ summary: 'Create Donor Payment' })
  @ApiResponse({
    status: 201,
    description: 'The Donor payment has been successfully created.',
  })
  @Post('donate')
  async donate(
    @Body() request: DonorDonateDto,
  ): Promise<BaseResponse<DonorDonateResponse>> {
    const donateResponse = await this.donorService.donate(request);
    return baseResponseHelper(
      donateResponse,
      HttpStatus.CREATED,
      'Donor has successfully donated!',
    );
  }

  @ApiOperation({ summary: 'Create Donor Payment' })
  @ApiResponse({
    status: 201,
    description: 'The Donor payment has been successfully created.',
  })
  @Post('donatePaytabs/webhook')
  async donatePaytabsWebhook(
    @Headers('signature') signature: string,
    @Body() payload: PaytabsIpnWebhookResponsePayload,
  ) {
    this.logger.debug(`webook paytabs from trans code: ${payload.tran_ref}`);
    this.logger.debug(JSON.stringify(payload));
    const serverKey = await this.donorService.getPaytabsServerKey();
    const isValidSignature = await this.paytabsService.verifySignature(
      payload,
      signature,
      serverKey,
    );
    if (!isValidSignature) {
      throw new Error('Invalid paytabs signature!');
    }
    await this.donorService.donatePaytabsWebhookHandler(payload);
    // to do
  }

  @ApiOperation({ summary: 'Create Donor Payment' })
  @ApiResponse({
    status: 201,
    description: 'The Donor payment has been successfully created.',
  })
  @Post('/donateStripe/webhook')
  async donateStripeWebhook(@Body() request: PaytabsIpnWebhookResponsePayload) {
    this.logger.debug(`webook paytabs from trans code: ${request.tran_ref}`);
    this.logger.debug(JSON.stringify(request));
    // !TODO: validate signature from Paytabs (valid from paytabs or not)
    await this.donorService.donateSingleItemCallback(request);
  }

  @ApiOperation({ summary: 'Create Donor Payment' })
  @ApiResponse({
    status: 201,
    description: 'The Donor payment has been successfully created.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/donate-item')
  async donateItem(
    @CurrentUser() user: ICurrentUser,
    @Body() request: DonorDonateItemDto,
  ): Promise<BaseResponse<DonorDonateItemResponse>> {
    const response = await this.donorService.donateSingleItem(user, request);
    return baseResponseHelper(
      response,
      HttpStatus.CREATED,
      'Donor has successfully donated to the item',
    );
  }

  @ApiOperation({ summary: 'Create Donor Payment' })
  @ApiResponse({
    status: 201,
    description: 'The Donor payment has been successfully created.',
  })
  @Post('/donate-item/callback')
  async donateItemCallback(@Body() request: PaytabsIpnWebhookResponsePayload) {
    this.logger.debug(`webook paytabs from trans code: ${request.tran_ref}`);
    this.logger.debug(JSON.stringify(request));
    // !TODO: validate signature from Paytabs (valid from paytabs or not)
    await this.donorService.donateSingleItemCallback(request);
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

  @Get('donorTransaction')
  async getTrxDonorList(
    @Query() filter: DonorListTrxDto,
    // ): Promise<PaginatedResponse<DonationLogDocument[]>> {
  ): Promise<PaginatedResponse<DonationLogsDocument[]>> {
    this.logger.debug('get All Donor Transaction');
    //return await this.donorService.getTrxDonorList(filter);

    const donorsList = await this.donorService.getTrxDonorList(filter);

    const response = paginationHelper(
      donorsList.docs,
      donorsList.totalDocs,
      donorsList.limit,
      donorsList.page,
      donorsList.totalPages,
      donorsList.pagingCounter,
      donorsList.hasPrevPage,
      donorsList.hasNextPage,
      donorsList.prevPage,
      donorsList.nextPage,
      HttpStatus.OK,
      'Successfully get list all donor transactions',
    );
    return response;
  }

  @Get('donorList')
  async getDonorList(
    @Query() filter: DonorListDto,
  ): Promise<PaginatedResponse<Donor[]>> {
    this.logger.debug('get All Donor List');

    const donorsList = await this.donorService.getDonorList(filter);

    const response = paginationHelper(
      donorsList.docs,
      donorsList.totalDocs,
      donorsList.limit,
      donorsList.page,
      donorsList.totalPages,
      donorsList.pagingCounter,
      donorsList.hasPrevPage,
      donorsList.hasNextPage,
      donorsList.prevPage,
      donorsList.nextPage,
      HttpStatus.OK,
      'Successfully get list all donor',
    );
    return response;
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

  @ApiOperation({ summary: 'Get Donation Donor Summary Dashboard' })
  @Get('totalDonationDonor/:donorId')
  async getTotalDonationDonor(
    @Param('donorId') donorId: string,
    @Query('currencyCode') currency: string,
  ) {
    this.logger.debug('get TotalDonationDonor');
    return await this.donorService.getTotalDonationDonor(donorId, currency);
  }

  @Get('organization/:organizationId/manager/getListAll')
  @UseGuards(JwtAuthGuard)
  async getDonorListAll(@Param('organizationId') organizationId: string) {
    this.logger.debug('findOne...');
    return await this.donorService.getDonorListAll(organizationId);
  }

  @Get(':donorId')
  async getDonor(@Param('donorId') donorId: string) {
    this.logger.debug('findOne...');
    return await this.donorService.getDonor(donorId);
  }

  @ApiOperation({ summary: 'Get list of success donation history by donorId' })
  @ApiResponse({
    status: 200,
    description: 'List of donation history sucessfully retrieved',
  })
  @Get(':donorId/history/getAllSuccess')
  async getAllSuccessDonation(@Param('donorId') donorId: string) {
    this.logger.debug('get success donation history ');
    return await this.donorService.getHistoryAllSuccess(donorId);
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
