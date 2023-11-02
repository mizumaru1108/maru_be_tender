import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
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
import { QAAddUserByJsonCommand } from '../commands/qa.add.user.by.json.command/qa.add.user.by.json.command';
import { QaProposalDeleteCommand } from '../commands/qa.proposal.delete/qa.proposal.delete.command';
import { QaProposalDeleteDto } from '../dto/requests/qa-proposal.delete.dto';
import { QAAddClientDataByJsonCommand } from '../commands/qa.add.client.data.command/qa.add.client.data.by.json.command';

@ApiTags('QAHelper User')
@Controller('qa-helper/user')
export class QaHelperUserControllers {
  constructor(private readonly commandBus: CommandBus) {}

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

  @ApiOperation({ summary: 'creating user by custom json' })
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('add-client-data-by-json')
  async addClientDataByJson() {
    try {
      const createProposalCommand = Builder<QAAddClientDataByJsonCommand>(
        QAAddClientDataByJsonCommand,
        {},
      ).build();

      await this.commandBus.execute<QAAddClientDataByJsonCommand>(
        createProposalCommand,
      );
      return baseResponseHelper(HttpStatus.OK);
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
