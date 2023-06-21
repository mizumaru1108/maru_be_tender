import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import { TenderProposalRepository } from '../../repositories/tender-proposal.repository';
import { ChangeProposalStateDto } from '../../dtos/requests';
import { logUtil } from '../../../../commons/utils/log-util';

export class ChangeStateCommand {
  currentUser: TenderCurrentUser;
  request: ChangeProposalStateDto;
}

@CommandHandler(ChangeStateCommand)
export class ChangeStateCommandHandler
  implements ICommandHandler<ChangeStateCommand>
{
  constructor(private readonly proposalRepo: TenderProposalRepository) {}
  async execute(command: ChangeStateCommand): Promise<any> {
    const proposalOld = await this.proposalRepo.fetchProposalById(
      command.request.proposal_id,
    );
    const proposal = await this.proposalRepo.fetchById({
      id: command.request.proposal_id,
    });

    return {
      old: proposalOld,
      entity: proposal,
    };
  }
}
