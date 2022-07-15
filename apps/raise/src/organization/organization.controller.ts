import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { rootLogger } from '../logger';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationDto } from './dto/organization.dto';
import { AppearancenDto } from './dto/appearance.dto';
import { NotificationSettingsDto } from './dto/notification_settings.dto';
import { FaqDto } from './dto/faq.dto';

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

  @Get('paymentGatewayList')
  async getPaymentGatewayList(@Query('organizationId') organizationId: string) {
    this.logger.debug('fetching payment gateway list...');
    return await this.organizationService.getPaymentGatewayList(organizationId);
  }

  @Get('insight')
  async getInsightSummary(@Query('organizationId') organizationId: string) {
    this.logger.debug('get insight summary...');
    return await this.organizationService.getInsightSummary(organizationId);
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
}
