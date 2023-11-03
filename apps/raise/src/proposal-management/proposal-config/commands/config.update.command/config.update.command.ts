import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProposalConfigEntity } from '../../entities/proposal.config.entity';
import { ProposalConfigRepository } from '../../repositories/proposal.config.repository';
import { NotFoundException } from '@nestjs/common';
export class ProposalConfigUpdateCommand {
  proposal_config_id: string;
  applying_status: boolean;
  indicator_of_project_duration_days: number;
  number_of_days_to_meet_business: number;
  hieght_project_budget: number;
  number_of_allowing_projects: number;
  ending_date: Date;
  starting_date: Date;
}

export class ProposalConfigUpdateCommandResult {
  data: ProposalConfigEntity;
}

@CommandHandler(ProposalConfigUpdateCommand)
export class ProposalConfigUpdateCommandHandler
  implements
    ICommandHandler<
      ProposalConfigUpdateCommand,
      ProposalConfigUpdateCommandResult
    >
{
  constructor(private readonly proposalConfigRepo: ProposalConfigRepository) {}

  async execute(
    command: ProposalConfigUpdateCommand,
  ): Promise<ProposalConfigUpdateCommandResult> {
    try {
      const existing = await this.proposalConfigRepo.findFirst({
        proposal_config_id: command.proposal_config_id,
      });
      if (!existing) throw new NotFoundException('Config not found!');

      const data = await this.proposalConfigRepo.update({
        ...command,
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
