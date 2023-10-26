import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron } from '@nestjs/schedule';
import { ApiBearerAuth, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from 'src/commons/decorators/base.api.ok.response.decorator';
import {
  PaymentSubmitClosingReportCommand,
  PaymentSubmitClosingReportCommandResult,
} from 'src/proposal-management/payment/commands/payment.submit.closing.report.command';
import { SubmitClosingReportDto } from 'src/proposal-management/payment/dtos/requests/submit.closing.report.dto';
import { BasePrismaErrorException } from 'src/tender-commons/exceptions/prisma-error/base.prisma.error.exception';
import { CurrentUser } from '../../../commons/decorators/current-user.decorator';
import { BaseResponse } from '../../../commons/dtos/base-response';
import { GetByIdDto } from '../../../commons/dtos/get-by-id.dto';
import { baseResponseHelper } from '../../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../../tender-auth/guards/tender-roles.guard';
import { DataNotFoundException } from '../../../tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from '../../../tender-commons/exceptions/forbidden-permission-exception';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { ManualPaginatedResponse } from '../../../tender-commons/helpers/manual-paginated-response.dto';
import { manualPaginationHelper } from '../../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { PaymentSendBatchReleaseNotifCommand } from '../commands/payment.send.batch.release.notif/payment.send.batch.release.notif.command';
import { ProposalInsertPaymentCommand } from '../commands/proposal.insert.payments.command.ts/proposal.insert.payments.command';
import { ProposalPaymentSendCloseReportCommand } from '../commands/proposal.send.close.report.command/proposal.send.close.report.command';
import { ProposalUpdatePaymentCommand } from '../commands/proposal.update.payments.command.ts/proposal.update.payments.command';
import {
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
import { InvalidAmountOfSupportException } from '../exceptions/invalid.amount.of.support.exception';
import { InvalidNumberofPaymentsException } from '../exceptions/invalid.number.of.payments.exception';
import { ProposalPaymentService } from '../services/proposal-payment.service';

@Controller('tender/proposal/payment')
export class ProposalPaymentController {
  constructor(
    private readonly paymentService: ProposalPaymentService,
    private readonly commandBus: CommandBus,
  ) {}

  paymentControllerErrorMapper(error: any) {
    if (error instanceof DataNotFoundException) {
      return new NotFoundException(error.message);
    }

    if (error instanceof ForbiddenPermissionException) {
      return new ForbiddenException(error.message);
    }

    if (
      error instanceof PayloadErrorException ||
      error instanceof InvalidNumberofPaymentsException ||
      error instanceof InvalidAmountOfSupportException
    ) {
      return new BadRequestException(error.message);
    }

    if (error instanceof BasePrismaErrorException) {
      return new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: error.message,
          error: error.stack ? JSON.parse(error.stack) : error.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return new InternalServerErrorException(error);
  }

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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
      throw this.paymentControllerErrorMapper(error);
    }
  }

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'after the payment complete client want to sent a closing report',
  })
  @ApiBearerAuth()
  @ApiSecurity('x-hasura-role')
  @BaseApiOkResponse(PaymentSubmitClosingReportCommandResult, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('submit-closing-report-cqrs')
  async submitClosingReport(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: SubmitClosingReportDto,
  ): Promise<BaseResponse<PaymentSubmitClosingReportCommandResult>> {
    try {
      const command = Builder<PaymentSubmitClosingReportCommand>(
        PaymentSubmitClosingReportCommand,
        {
          dto,
          currentUser,
        },
      ).build();

      const result = await this.commandBus.execute<
        PaymentSubmitClosingReportCommand,
        PaymentSubmitClosingReportCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.CREATED,
        'Close Report Created Successfully!',
      );
    } catch (e) {
      throw this.paymentControllerErrorMapper(e);
    }
  }

  @Cron('0 0 * * *')
  async supervisorBatchReleaseNotif() {
    try {
      const command = Builder<PaymentSendBatchReleaseNotifCommand>(
        PaymentSendBatchReleaseNotifCommand,
        {},
      ).build();

      await this.commandBus.execute<PaymentSendBatchReleaseNotifCommand>(
        command,
      );

      return baseResponseHelper(
        '',
        HttpStatus.CREATED,
        'Batch release notif sended successfully!',
      );
    } catch (e) {
      throw this.paymentControllerErrorMapper(e);
    }
  }

  // deprecated
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

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_cashier',
    'tender_finance',
    'tender_project_manager',
    'tender_project_supervisor',
  )
  @Patch('update-payment-cqrs')
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
      throw this.paymentControllerErrorMapper(error);
    }
  }

  // DEPRECEATED
  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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

  // DEPRECATED
  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles(
    'tender_cashier',
    'tender_finance',
    'tender_project_manager',
    'tender_project_supervisor',
  )
  @Patch('send-closing-report-cqrs')
  async sendCloseReport(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: SendClosingReportDto,
  ): Promise<BaseResponse<any>> {
    try {
      const sendCloseReportCommand =
        Builder<ProposalPaymentSendCloseReportCommand>(
          ProposalPaymentSendCloseReportCommand,
          {
            currentUser,
            request,
          },
        ).build();

      const response = await this.commandBus.execute(sendCloseReportCommand);

      return baseResponseHelper(
        response,
        HttpStatus.CREATED,
        'Payment updated successfully',
      );
    } catch (error) {
      throw this.paymentControllerErrorMapper(error);
    }
  }

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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
  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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

  @ApiSecurity('x-hasura-role')
  @ApiBearerAuth()
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
