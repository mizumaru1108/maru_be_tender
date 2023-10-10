import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { DataNotFoundException } from '../../tender-commons/exceptions/data-not-found.exception';
import { PayloadErrorException } from '../../tender-commons/exceptions/payload-error.exception';
import {
  PurgeUserCommand,
  PurgeUserCommandResult,
} from '../commands/purge.user.command.ts/purge.user.command';
import { QaProposalCreateNewModeratorStateCommand } from '../commands/qa.proposal.create.new.moderator/qa.proposal.create.new.moderator.command';
import { QaProposalCreateNewSupervisorCommand } from '../commands/qa.proposal.create.new.supervisor/qa.proposal.create.new.supervisor.command';
import { QaProposalDeleteCommand } from '../commands/qa.proposal.delete/qa.proposal.delete.command';
import { PurgeUserDto } from '../dto/requests/purge.user.dto';
import { QaProposalCreateSupervisorDto } from '../dto/requests/qa-proposal-create-supervisor.dto';
import { QaProposalCreateDto } from '../dto/requests/qa-proposal-create.dto';
import { QaProposalDeleteDto } from '../dto/requests/qa-proposal.delete.dto';

@ApiTags('QAHelper Proposal')
@Controller('qa-helper/proposal')
export class QaHelperControllers {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create-moderator')
  async createProposal(@Body() request: QaProposalCreateDto) {
    try {
      const createProposalCommand =
        Builder<QaProposalCreateNewModeratorStateCommand>(
          QaProposalCreateNewModeratorStateCommand,
          {
            project_name: request.name,
            submitter_user_id: request.client_user_id,
          },
        ).build();

      const result = await this.commandBus.execute(createProposalCommand);
      return baseResponseHelper(result, HttpStatus.OK);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('create-supervisor')
  async createProposalSupervisor(
    @Body() request: QaProposalCreateSupervisorDto,
  ) {
    try {
      const createProposalCommand =
        Builder<QaProposalCreateNewSupervisorCommand>(
          QaProposalCreateNewSupervisorCommand,
          {
            ...request,
            project_name: request.name,
            submitter_user_id: request.client_user_id,
          },
        ).build();

      const result = await this.commandBus.execute(createProposalCommand);
      return baseResponseHelper(result, HttpStatus.OK);
    } catch (error) {
      if (error instanceof DataNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof PayloadErrorException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Deleting user and all it related data' })
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('purge-user')
  async purgeUser(@Body() dto: PurgeUserDto) {
    try {
      const createProposalCommand = Builder<PurgeUserCommand>(
        PurgeUserCommand,
        dto,
      ).build();

      const { data } = await this.commandBus.execute<
        PurgeUserCommand,
        PurgeUserCommandResult
      >(createProposalCommand);
      return baseResponseHelper(data, HttpStatus.OK);
    } catch (error) {
      if (error instanceof DataNotFoundException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof PayloadErrorException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Delete('delete/:id')
  async deleteProposal(@Param() request: QaProposalDeleteDto) {
    try {
      const createProposalCommand = Builder<QaProposalDeleteCommand>(
        QaProposalDeleteCommand,
        {
          id: request.id,
        },
      ).build();

      const result = await this.commandBus.execute(createProposalCommand);
      return baseResponseHelper(result, HttpStatus.OK);
    } catch (error) {
      if (error instanceof DataNotFoundException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof PayloadErrorException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
