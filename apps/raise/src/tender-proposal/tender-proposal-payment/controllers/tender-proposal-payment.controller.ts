import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { proposal } from '@prisma/client';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { GetByIdDto } from '../../../commons/dtos/get-by-id.dto';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import {
  CreateProposalPaymentDto,
  AskClosingReportDto,
  UpdatePaymentDto,
  SendClosingReportDto,
  CreateTrackBudgetDto,
} from '../dtos/requests';
import { UpdatePaymentResponseDto } from '../dtos/responses';
import { TenderProposalPaymentService } from '../services/tender-proposal-payment.service';

@Controller('tender/proposal/payment')
export class TenderProposalPaymentController {
  constructor(private readonly paymentService: TenderProposalPaymentService) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Post('insert-payment')
  async insertPayment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateProposalPaymentDto,
  ): Promise<BaseResponse<proposal>> {
    const createdPayment = await this.paymentService.insertPayment(
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
  @TenderRoles('tender_admin')
  @Post('add-track-budget')
  async addBudget(
    @Body() request: CreateTrackBudgetDto,
  ): Promise<BaseResponse<any>> {
    const createdPayment = await this.paymentService.addTrackBudget(request);
    return baseResponseHelper(
      createdPayment,
      HttpStatus.CREATED,
      'Track Budgets added successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('submit-closing-report')
  async askClosingReport(
    @CurrentUser() user: TenderCurrentUser,
    @Body() request: AskClosingReportDto,
  ): Promise<BaseResponse<any>> {
    const response = await this.paymentService.submitClosingReport(
      user,
      request,
    );

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Asking for changes successfully applied!, please wait untill account manager responded to your request',
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
    const updatedPayment = await this.paymentService.updatePayment(
      currentUser,
      request,
    );
    return baseResponseHelper(
      updatedPayment,
      HttpStatus.OK,
      'Payment updated successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_cashier')
  @Patch('complete-payment')
  async completePayment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: GetByIdDto,
  ): Promise<any> {
    const updatedPayment = await this.paymentService.completePayment(
      currentUser,
      request.id,
    );

    return baseResponseHelper(
      updatedPayment,
      HttpStatus.OK,
      'Payment completed successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Patch('send-closing-report')
  async sendClosingReport(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: SendClosingReportDto,
  ): Promise<any> {
    const updatedPayment = await this.paymentService.sendClosingReport(
      currentUser,
      request,
    );

    return baseResponseHelper(
      updatedPayment,
      HttpStatus.OK,
      'Closing report successfully done',
    );
  }
}
