import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { rootLogger } from '../logger';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

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
}
