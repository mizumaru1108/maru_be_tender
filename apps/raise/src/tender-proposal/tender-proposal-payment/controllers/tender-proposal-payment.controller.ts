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
import { CreateProposalPaymentDto } from '../dtos/requests/create-payment.dto';
import { SendClosingReportDto } from '../dtos/requests/send-closing-report.dto';
import { UpdatePaymentDto } from '../dtos/requests/update-payment.dto';
import { UpdatePaymentResponseDto } from '../dtos/responses/update-payment-response.dto';
import { TenderProposalPaymentService } from '../services/tender-proposal-payment.service';

@Controller('tender/proposal/payment')
export class TenderProposalPaymentController {
  constructor(
    private readonly tenderProposalPaymentService: TenderProposalPaymentService,
  ) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Post('insert-payment')
  async insertPayment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateProposalPaymentDto,
  ): Promise<BaseResponse<proposal>> {
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

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_cashier')
  @Patch('complete-payment')
  async completePayment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: GetByIdDto,
  ): Promise<any> {
    const updatedPayment =
      await this.tenderProposalPaymentService.completePayment(
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
    const updatedPayment =
      await this.tenderProposalPaymentService.sendClosingReport(
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
