import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { QaProposalCreateDto } from '../dto/requests/qa-proposal-create.dto';
import { QaProposalCreateNewCommand } from '../commands/qa.proposal.create.new/qa.proposal.create.new.command';
import { QaProposalDeleteDto } from '../dto/requests/qa-proposal.delete.dto';
import { QaProposalDeleteGeneratedCommand } from '../commands/qa.proposal.delete.generated/qa.proposal.delete.generated.command';
import { DataNotFoundException } from '../../tender-commons/exceptions/data-not-found.exception';
import { QaProposalDeleteCommand } from '../commands/qa.proposal.delete/qa.proposal.delete.command';

@ApiTags('qa-helper')
@Controller('qa-helper')
export class QaHelperControllers {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('proposal/create')
  async createProposal(@Body() request: QaProposalCreateDto) {
    console.log({ request });
    try {
      const createProposalCommand = Builder<QaProposalCreateNewCommand>(
        QaProposalCreateNewCommand,
        {
          project_name: request.name,
          submitter_user_id: request.client_user_id,
        },
      ).build();

      const result = await this.commandBus.execute(createProposalCommand);
      return baseResponseHelper(result, HttpStatus.OK);
    } catch (error) {
      throw error;
    } /*  */
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Delete('proposal/delete/:id')
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
      throw error;
    }
  }

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Delete('proposal/delete-generated/:id')
  async deleteGeneratedProposal(@Param() request: QaProposalDeleteDto) {
    try {
      const createProposalCommand = Builder<QaProposalDeleteGeneratedCommand>(
        QaProposalDeleteGeneratedCommand,
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
      throw error;
    }
  }
}
