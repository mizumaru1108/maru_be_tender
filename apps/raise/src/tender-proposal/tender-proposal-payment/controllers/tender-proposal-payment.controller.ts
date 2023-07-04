import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { GetByIdDto } from '../../../commons/dtos/get-by-id.dto';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import {
  AskClosingReportDto,
  BankDetailsDto,
  BankListCreateDto,
  CreateProposalPaymentDto,
  CreateTrackBudgetDto,
  DeleteTrackBudgetDto,
  FindBankListFilter,
  FindTrackBudgetFilter,
  SendClosingReportDto,
  UpdatePaymentDto,
  UpdateTrackBudgetDto,
} from '../dtos/requests';
import { UpdatePaymentResponseDto } from '../dtos/responses';
import { TenderProposalPaymentService } from '../services/tender-proposal-payment.service';
import { DataNotFoundException } from '../../../tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from '../../../tender-commons/exceptions/forbidden-permission-exception';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { CommandBus } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { ProposalInsertPaymentCommand } from '../commands/proposal.insert.payments.command.ts/proposal.insert.payments.command';
import { InvalidNumberofPaymentsException } from '../exceptions/invalid.number.of.payments.exception';
import { InvalidAmountOfSupportException } from '../exceptions/invalid.amount.of.support.exception';
import { ProposalUpdatePaymentCommand } from '../commands/proposal.update.payments.command.ts/proposal.update.payments.command';

@Controller('tender/proposal/payment')
export class TenderProposalPaymentController {
  constructor(
    private readonly paymentService: TenderProposalPaymentService,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Post('insert-payment-cqrs')
  async insertPayments(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateProposalPaymentDto,
  ): Promise<BaseResponse<any>> {
    try {
      const insertPaymentCommand = Builder<ProposalInsertPaymentCommand>(
        ProposalInsertPaymentCommand,
        {
          currentUserId: currentUser.id,
          proposal_id: request.proposal_id,
          payments: request.payments,
        },
      ).build();

      const createdPayment = await this.commandBus.execute(
        insertPaymentCommand,
      );

      return baseResponseHelper(
        createdPayment,
        HttpStatus.CREATED,
        'Payment created successfully',
      );
    } catch (error) {
      if (error instanceof DataNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ForbiddenPermissionException) {
        throw new ForbiddenException(error.message);
      }
      if (
        error instanceof PayloadErrorException ||
        error instanceof InvalidNumberofPaymentsException ||
        error instanceof InvalidAmountOfSupportException
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_project_supervisor')
  @Post('insert-payment')
  async insertPayment(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: CreateProposalPaymentDto,
  ): Promise<BaseResponse<any>> {
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
  @TenderRoles('tender_admin', 'tender_ceo')
  @Get('find-track-budgets')
  async findTrackBudgets(
    @Query() filter: FindTrackBudgetFilter,
  ): Promise<ManualPaginatedResponse<any>> {
    const response = await this.paymentService.findTrackBudgets(filter);

    return manualPaginationHelper(
      response.data,
      response.total,
      filter.page || 1,
      filter.limit || 0,
      HttpStatus.OK,
      'Success',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_project_supervisor',
    'tender_project_manager',
    'tender_finance',
    'tender_cashier',
    'tender_admin',
  )
  @Get('find-track-budget')
  async findTrackBudgetsByTrackId(
    @Query() filter: FindTrackBudgetFilter,
  ): Promise<BaseResponse<any>> {
    const response = await this.paymentService.findTrackBudget(filter);

    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Asking for changes successfully applied!, please wait untill account manager responded to your request',
    );
  }

  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles('tender_admin')
  // @Get('find-section-budget')
  // async findSectionBudgets(
  //   @CurrentUser() currentUser: TenderCurrentUser,
  //   @Query() filter: any, // keep itsimple refactor latter
  // ): Promise<ManualPaginatedResponse<any>> {
  //   const response = await this.paymentService.findSectionBudgets(
  //     currentUser,
  //     filter,
  //   );

  //   return manualPaginationHelper(
  //     response.data,
  //     response.total,
  //     filter.page || 1,
  //     filter.limit || 10,
  //     HttpStatus.OK,
  //     'Success',
  //   );
  // }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_cashier',
    'tender_finance',
    'tender_project_manager',
    'tender_project_supervisor',
  )
  @Post('update-payment-cqrs')
  async updatePayments(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: UpdatePaymentDto,
  ): Promise<BaseResponse<any>> {
    try {
      const updatePaymentCommand = Builder<ProposalUpdatePaymentCommand>(
        ProposalUpdatePaymentCommand,
        {
          currentUser,
          request,
        },
      ).build();

      const updatedPayment = await this.commandBus.execute(
        updatePaymentCommand,
      );

      return baseResponseHelper(
        updatedPayment,
        HttpStatus.CREATED,
        'Payment updated successfully',
      );
    } catch (error) {
      if (error instanceof DataNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ForbiddenPermissionException) {
        throw new ForbiddenException(error.message);
      }
      if (
        error instanceof PayloadErrorException ||
        error instanceof InvalidNumberofPaymentsException ||
        error instanceof InvalidAmountOfSupportException
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
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

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('delete-track-budget')
  async deleteTrackBudget(
    @Body() request: DeleteTrackBudgetDto,
  ): Promise<BaseResponse<any>> {
    const createdPayment = await this.paymentService.deleteTrackBudget(request);
    return baseResponseHelper(
      createdPayment,
      HttpStatus.CREATED,
      'Track Budgets added successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update-track-budget')
  async updateTrackBudget(
    @Body() request: UpdateTrackBudgetDto,
  ): Promise<BaseResponse<any>> {
    const createdPayment = await this.paymentService.updateTrackBudget(request);
    return baseResponseHelper(
      createdPayment,
      HttpStatus.CREATED,
      'Track Budgets updated successfully',
    );
  }

  // Bank list
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('add-bank-list')
  async addBanks(
    @Body() request: BankListCreateDto,
  ): Promise<BaseResponse<any>> {
    const createdBank = await this.paymentService.addBankList(request);

    return baseResponseHelper(
      createdBank,
      HttpStatus.CREATED,
      'Bank list added successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('update-bank')
  async updateBanks(
    @Body() request: BankListCreateDto,
  ): Promise<BaseResponse<any>> {
    const updatedBank = await this.paymentService.updateBankList(request);

    return baseResponseHelper(
      updatedBank,
      HttpStatus.OK,
      'Bank list updated successfully',
    );
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Patch('bank/soft-delete')
  async softDelete(@Body() request: GetByIdDto) {
    const response = await this.paymentService.softDeleteBank(request);

    return baseResponseHelper(response, HttpStatus.OK, 'Bank soft deleted');
  }

  @Get('find-bank-list')
  async findBankList(
    @Query() filter: FindBankListFilter,
  ): Promise<ManualPaginatedResponse<any>> {
    const response = await this.paymentService.findBankLists(filter);

    return manualPaginationHelper(
      response.data,
      response.total,
      filter.page || 1,
      filter.limit || 10,
      HttpStatus.OK,
      'Success',
    );
  }

  @Get('find-bank-details')
  async findBankDetails(
    @Query() request: BankDetailsDto,
  ): Promise<BaseResponse<any>> {
    const response = await this.paymentService.findBankDetails(request);

    return baseResponseHelper(response, HttpStatus.OK, 'Bank details');
  }
}
