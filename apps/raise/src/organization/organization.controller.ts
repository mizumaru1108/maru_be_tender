import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { rootLogger } from '../logger';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationDto } from './dto/organization.dto';
import { AppearancenDto } from './dto/appearance.dto';
import { NotificationSettingsDto } from './dto/notification_settings.dto';
import { FaqDto } from './dto/faq.dto';
import { PaymentGateWayDto } from 'src/payment-stripe/dto/paymentGateway.dto';
import { NotificationDto } from './dto/notification.dto';
import {
  NonProfitAppearancePageDto,
  EditNonProfitAppearancePageDto,
} from './dto/nonprofit_appearance_page.dto';
import {
  NonProfitAppearanceNavigationAboutUsDto,
  NonProfitAppearanceNavigationBlogDto,
  NonProfitAppearanceNavigationDto,
  EditNonProfitAppearanceNavigationBlogDto,
  EditNonProfApperNavDto,
  EditNonProfApperNavAboutUsDto,
} from './dto/nonprofit_appearance_navigation.dto';
import { DonorsFilterDto, FilterDonorDashboardDto } from './dto';
import { PaginatedResponse } from 'src/commons/dtos/paginated-response.dto';
import { paginationHelper } from 'src/commons/helpers/pagination-helper';
import { BaseResponse } from 'src/commons/dtos/base-response';
import { AppearanceNavigation } from './schema/nonprofit_appearance_navigation.schema';
import { baseResponseHelper } from 'src/commons/helpers/base-response-helper';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { DonationLogsDocument } from '../donation/schema/donation_log.schema';

@ApiTags('orgs')
@Controller('orgs')
export class OrganizationController {
  private logger = rootLogger.child({ logger: OrganizationController.name });

  constructor(private organizationService: OrganizationService) {}

  @Get('getListAll')
  async findAll() {
    this.logger.debug('findAll...');
    return await this.organizationService.findAll();
    // return { message: 'hello' };
  }

  @Get(':organizationId')
  async getOrganization(@Param('organizationId') organizationId: string) {
    this.logger.debug('findOne...');
    return await this.organizationService.getOrganization(organizationId);
  }

  @Patch(':organizationId')
  async updateOrganization(
    @Param('organizationId') organizationId: string,
    @Body() organizationDto: OrganizationDto,
  ) {
    this.logger.debug('update Organization...');
    return await this.organizationService.updateOrganization(
      organizationId,
      organizationDto,
    );
  }

  @Get('appearance/:organizationId')
  async getAppearance(@Param('organizationId') organizationId: string) {
    this.logger.debug('findOne...');
    return await this.organizationService.getAppearance(organizationId);
  }

  @Post('appearance/:organizationId/create')
  async createAppearance(
    @Param('organizationId') organizationId: string,
    @Body() appearanceDto: AppearancenDto,
  ) {
    this.logger.debug('create Appearance Organization...');
    return await this.organizationService.createAppearance(
      organizationId,
      appearanceDto,
    );
  }

  @Patch('appearance/:appearanceId/update')
  async updateAppearance(
    @Param('organizationId') organizationId: string,
    @Body() appearanceDto: AppearancenDto,
  ) {
    this.logger.debug('update Appearance Organization...');
    return await this.organizationService.updateAppearance(
      organizationId,
      appearanceDto,
    );
  }

  @Get('donors')
  async getDonorList(@Query('organizationId') organizationId: string) {
    this.logger.debug('fetching donor list...');
    return await this.organizationService.getDonorList(organizationId);
  }

  @Get('donor')
  async getDonorsList(
    @Query() filter: DonorsFilterDto,
  ): Promise<PaginatedResponse<DonationLogsDocument[]>> {
    this.logger.debug('fetching donors list...');

    const donorsList = await this.organizationService.getDonorsList(filter);
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
      'Successfully get list all donors',
    );
    return response;
  }

  @Get(':organizationId/paymentGateway')
  async getPaymentGatewayList(@Param('organizationId') organizationId: string) {
    this.logger.debug('fetching payment gateway list...');
    return await this.organizationService.getPaymentGatewayList(organizationId);
  }

  @Post(':organizationId/paymentGateway')
  async addPaymentGateway(
    @Param('organizationId') organizationId: string,
    @Body() paymentGatewayDto: PaymentGateWayDto,
  ) {
    this.logger.debug('add new payment gateway...');
    return await this.organizationService.addNewPaymentGateWay(
      organizationId,
      paymentGatewayDto,
    );
  }

  @Get('insight')
  async getInsightSummary(
    @Query('organizationId') organizationId: string,
    @Query('period') period: string,
  ) {
    this.logger.debug('get insight summary...');
    return await this.organizationService.getInsightSummary(
      organizationId,
      period,
    );
  }

  @Get('notification-settings/:organizationId')
  async getNotificationSettings(
    @Param('organizationId') organizationId: string,
  ) {
    this.logger.debug('get notification settings...');
    return await this.organizationService.getNotifSettings(organizationId);
  }

  @Post('notification-settings')
  async createNotificationSettings(
    @Body() notifSettingsDto: NotificationSettingsDto,
  ) {
    this.logger.debug('get notification settings...');
    return await this.organizationService.createNotificationSettings(
      notifSettingsDto,
    );
  }

  @Patch('notification-settings/:organizationId')
  async updateNotificationSettings(
    @Param('organizationId') organizationId: string,
    @Body() notifSettingsDto: NotificationSettingsDto,
  ) {
    this.logger.debug('get notification settings...');
    return await this.organizationService.updateNotifSettings(
      organizationId,
      notifSettingsDto,
    );
  }

  @Get('notifications')
  async getNotificationList(
    @Query('organizationId') organizationId: string,
    @Query('type') type: string,
  ) {
    this.logger.debug('fetching notification list...');
    return await this.organizationService.getNotificationList(
      organizationId,
      type,
    );
  }

  @Post(':organizationId/notifications/add')
  async addNotification(
    @Param('organizationId') organizationId: string,
    @Body('notification') notificationDto: NotificationDto,
  ) {
    this.logger.debug('create new notification...');
    return await this.organizationService.addNotification(
      organizationId,
      notificationDto,
    );
  }

  @Get('faq')
  async getFaqList(@Query('organizationId') organizationId: string) {
    this.logger.debug('fetching faq list...');
    return await this.organizationService.getFaqList(organizationId);
  }

  @Post('faq')
  async createFaq(@Body() faqDto: FaqDto) {
    this.logger.debug('create fqa...');
    return await this.organizationService.createFaq(faqDto);
  }

  @Post('faq/:faqId')
  async updateFaq(@Param('faqId') faqId: string, @Body() faqDto: FaqDto) {
    this.logger.debug('update fqa...');
    return await this.organizationService.updateFaq(faqId, faqDto);
  }

  @Post(':organizationId/landingPage')
  async createLandingPage(
    @Param('organizationId') organizationId: string,
    @Body() nonProfitAppearanceNavigationDto: NonProfitAppearanceNavigationDto,
  ) {
    return await this.organizationService.createLandingPage(
      organizationId,
      nonProfitAppearanceNavigationDto,
    );
  }

  @Post(':organizationId/aboutUs')
  async createAboutUs(
    @Param('organizationId') organizationId: string,
    @Body()
    nonProfitAppearanceNavigationAboutUsDto: NonProfitAppearanceNavigationAboutUsDto,
  ) {
    return this.organizationService.createAboutUs(
      organizationId,
      nonProfitAppearanceNavigationAboutUsDto,
    );
  }

  @Post(':organizationId/blog')
  async createBlog(
    @Param('organizationId') organizationId: string,
    @Body()
    nonProfitAppearanceNavigationBlogDto: NonProfitAppearanceNavigationBlogDto,
  ) {
    return this.organizationService.createBlog(
      organizationId,
      nonProfitAppearanceNavigationBlogDto,
    );
  }

  @ApiOperation({ summary: 'create contactUs' })
  @UseGuards(JwtAuthGuard)
  @Post(':organizationId/contactUs')
  async createContactUs(
    @Param('organizationId') organizationId: string,
    @Body() nonProfitAppearancePageDto: NonProfitAppearancePageDto,
  ) {
    return this.organizationService.createContactUs(
      organizationId,
      nonProfitAppearancePageDto,
    );
  }

  @ApiOperation({ summary: 'update landingPage' })
  @UseGuards(JwtAuthGuard)
  @Patch(':organizationId/landingPage')
  async editLandingPage(
    @Param('organizationId') organizationId: string,
    @Body()
    editNonProfitAppearanceNavigationDto: EditNonProfApperNavDto,
  ): Promise<BaseResponse<AppearanceNavigation>> {
    this.logger.debug(
      'update landingPage',
      JSON.stringify(editNonProfitAppearanceNavigationDto),
    );
    const editLandingPage = await this.organizationService.editLandingPage(
      organizationId,
      editNonProfitAppearanceNavigationDto,
    );
    const response = baseResponseHelper(
      editLandingPage,
      HttpStatus.OK,
      'LandingPage updated',
    );
    return response;
  }

  @ApiOperation({ summary: 'update aboutUs' })
  @UseGuards(JwtAuthGuard)
  @Patch(':organizationId/aboutUs')
  async editAboutUs(
    @Param('organizationId') organizationId: string,
    @Body()
    EditNonProfApperNavAboutUsDto: EditNonProfApperNavAboutUsDto,
  ): Promise<BaseResponse<AppearanceNavigation>> {
    this.logger.debug(
      'update aboutUs',
      JSON.stringify(EditNonProfApperNavAboutUsDto),
    );
    const editAboutUs = await this.organizationService.editAboutUs(
      organizationId,
      EditNonProfApperNavAboutUsDto,
    );
    const response = baseResponseHelper(
      editAboutUs,
      HttpStatus.OK,
      'LandingPage updated',
    );
    return response;
  }

  @ApiOperation({ summary: 'update blog' })
  @UseGuards(JwtAuthGuard)
  @Patch(':organizationId/blog')
  async editBlog(
    @Param('organizationId') organizationId: string,
    @Body()
    editNonProfitAppearanceNavigationBlogDto: EditNonProfitAppearanceNavigationBlogDto,
  ): Promise<BaseResponse<AppearanceNavigation>> {
    this.logger.debug(
      'update blog',
      JSON.stringify(editNonProfitAppearanceNavigationBlogDto),
    );
    const blogData = await this.organizationService.editBlog(
      organizationId,
      editNonProfitAppearanceNavigationBlogDto,
    );
    const response = baseResponseHelper(
      blogData,
      HttpStatus.OK,
      'Blog updated',
    );
    return response;
  }

  @ApiOperation({ summary: 'update contactUs' })
  @UseGuards(JwtAuthGuard)
  @Patch(':organizationId/contactUs')
  async editContactUs(
    @Param('organizationId') organizationId: string,
    @Body() editNonProfitAppearancePageDto: EditNonProfitAppearancePageDto,
  ) {
    this.logger.debug(
      'update contactUs',
      JSON.stringify(editNonProfitAppearancePageDto),
    );
    return this.organizationService.editContactUs(
      organizationId,
      editNonProfitAppearancePageDto,
    );
  }
  @Get(':organizationId/landingPage')
  async getLandingPage(
    @Param('organizationId') organizationId: string,
    @Query() page: string,
  ) {
    return await this.organizationService.getLandingPage(organizationId);
  }
  @Get(':organizationId/aboutUs')
  async getAboutUs(
    @Param('organizationId') organizationId: string,
    @Query() page: string,
  ) {
    return this.organizationService.getAboutUs(organizationId);
  }
  @Get(':organizationId/blog')
  async getBlog(
    @Param('organizationId') organizationId: string,
    @Query() page: string,
  ) {
    return this.organizationService.getBlog(organizationId);
  }
  @Get(':organizationId/contactUs')
  async getContactUs(@Param('organizationId') organizationId: string) {
    return this.organizationService.getContactUs(organizationId);
  }
  @Get('donor/:organizationId/:donorId')
  async getInsightSummaryDonorId(
    @Param('organizationId') organizationId: string,
    @Param('donorId') donorId: string,
    @Query('period') period: string,
    @Query() filter: FilterDonorDashboardDto,
  ) {
    return this.organizationService.getInsightSummaryDonorId(
      organizationId,
      donorId,
      period,
      filter,
    );
  }
}
