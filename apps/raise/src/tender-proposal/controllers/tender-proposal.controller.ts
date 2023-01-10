import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { CreateProposalPaymentDto } from '../dtos/requests/payment/create-payment.dto';
import { ChangeProposalStateDto } from '../dtos/requests/proposal/change-proposal-state.dto';

import { TenderProposalPaymentService } from '../services/tender-proposal-payment.service';

import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { TenderProposalService } from '../services/tender-proposal.service';
import { UpdatePaymentDto } from '../dtos/requests/payment/update-payment.dto';
import { UpdatePaymentResponseDto } from '../dtos/responses/payment/update-payment-response.dto';
import { UpdateProposalDto } from '../dtos/requests/proposal/update-proposal.dto';
import { UpdateProposalResponseDto } from '../dtos/responses/proposal/update-proposal-response.dto';
import { UpdateProposalByCmsUsers } from '../dtos/updateProposalByCmsUsers.dto';
import { user } from '@prisma/client';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { CreateNotificationDto } from '../../tender-notification/dtos/requests/create-notification.dto';
import { CreateProposalNotificationDto } from '../dtos/requests/proposal/create-proposal-notification.dto';
@Controller('tender-proposal')
export class TenderProposalController {
  constructor(
    private readonly tenderProposalService: TenderProposalService,
    private readonly tenderProposalPaymentService: TenderProposalPaymentService,
  ) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Post('insert-payment')
  async insertPayment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateProposalPaymentDto,
  ): Promise<BaseResponse<Prisma.paymentCreateManyInput[]>> {
    const createdPayment =
      await this.tenderProposalPaymentService.insertPayment(
        currentUser.id,
        request,
      );
    return baseResponseHelper(
      createdPayment,
      HttpStatus.CREATED,
      'Payment created successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_accounts_manager',
    'tender_admin',
    'tender_cashier',
    'tender_ceo',
    'tender_consultant',
    'tender_finance',
    'tender_moderator',
    'tender_project_manager',
    'tender_project_supervisor',
  ) // only internal users
  @Post('send-notification')
  async sendNotification(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateProposalNotificationDto,
  ) {
    const createdPayment = await this.tenderProposalService.sendNotification(
      currentUser,
      request,
    );
    return baseResponseHelper(
      createdPayment,
      HttpStatus.CREATED,
      'Payment created successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Get('fetch-track')
  async fetchTrack(
    @Query() { limit = 10, page = 1 }: BaseFilterRequest,
  ): Promise<BaseResponse<any>> {
    const result = await this.tenderProposalService.fetchTrack(limit, page);

    return manualPaginationHelper(
      result.data,
      result.total,
      page,
      limit,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_cashier',
    'tender_finance',
    'tender_project_manager',
    'tender_project_supervisor',
  )
  @Patch('update-payment')
  async updatePayment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: UpdatePaymentDto,
  ): Promise<BaseResponse<UpdatePaymentResponseDto>> {
    const updatedPayment =
      await this.tenderProposalPaymentService.updatePayment(
        currentUser,
        request,
      );
    return baseResponseHelper(
      updatedPayment,
      HttpStatus.OK,
      'Payment updated successfully',
    );
  }

  /**
   * changing proposal state (acc/reject, create logs)
   */
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_moderator',
    'tender_project_supervisor',
    'tender_project_manager',
    'tender_ceo',
  )
  @Patch('change-state')
  changeProposalState(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: ChangeProposalStateDto,
  ) {
    return this.tenderProposalService.changeProposalState(currentUser, request);
  }

  @UseGuards(TenderJwtGuard)
  @Patch('update-draft')
  async updateDraft(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: UpdateProposalDto,
  ): Promise<BaseResponse<UpdateProposalResponseDto>> {
    const updateResponse = await this.tenderProposalService.updateProposal(
      currentUser.id,
      request,
    );
    return baseResponseHelper(
      updateResponse,
      HttpStatus.OK,
      'Proposal updated successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Patch('update-proposal')
  async updateProposal(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() request: UpdateProposalDto,
  ): Promise<BaseResponse<UpdateProposalResponseDto>> {
    const updateResponse = await this.tenderProposalService.updateProposal(
      currentUser.id,
      request,
    );
    return baseResponseHelper(
      updateResponse,
      HttpStatus.OK,
      'Proposal updated successfully',
    );
  }

  @UseGuards(TenderJwtGuard)
  @Patch('proposal-action')
  async updateProposalByCmsUsers(
    @CurrentUser() currentUser: user,
    @Body() body: UpdateProposalByCmsUsers,
    @Req() request: any,
  ) {
    const updateResponse =
      await this.tenderProposalService.updateProposalByCmsUsers(
        currentUser,
        body,
        request.query.id,
        request.headers['x-hasura-role'],
      );
    return baseResponseHelper(
      updateResponse,
      HttpStatus.OK,
      'Proposal updated successfully',
    );
  }
}
