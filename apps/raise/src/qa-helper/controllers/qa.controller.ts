import { Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { ProposalCreateCommand } from '../commands/proposal.create/proposal.create.command';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';

@ApiTags('qa-helper')
@Controller('qa-helper')
export class QaHelperControllers {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Post('proposal/create')
  async createProposal() {
    try {
      const createProposalCommand = Builder<ProposalCreateCommand>(
        ProposalCreateCommand,
      ).build();

      const result = await this.commandBus.execute(createProposalCommand);
      return baseResponseHelper(result, HttpStatus.OK);
    } catch (error) {
      throw error;
    }
  }
}
