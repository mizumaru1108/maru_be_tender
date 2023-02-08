import {
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma, proposal } from '@prisma/client';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderProposalFollowUpService } from '../../tender-proposal-follow-up/services/tender-proposal-follow-up.service';
import { CreateProposalPaymentDto } from '../dtos/requests/create-payment.dto';
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
}
