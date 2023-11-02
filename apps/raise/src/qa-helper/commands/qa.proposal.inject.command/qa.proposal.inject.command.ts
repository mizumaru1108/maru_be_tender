import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma/prisma.service';
import { proposalData } from './proposal.data';

export class QaProposalInjectCommand {}

@CommandHandler(QaProposalInjectCommand)
export class QaProposalInjectCommandHandler
  implements ICommandHandler<QaProposalInjectCommand, void>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: QaProposalInjectCommand): Promise<void> {
    const data = proposalData;

    await this.prismaService.$transaction(
      async (session) => {
        for (const proposal of data) {
          // project_name, project_idea, project_outputs, pm name, pm email, pm mobile, created_at,
          const createdProposal = await session.proposal.create({
            data: {
              id: proposal.proposal_id,
              project_name: proposal.proj_req_proj,
              project_idea: proposal.proj_req_teaser,
              project_outputs: proposal.proj_req_output,
              submitter_user_id: proposal.fusionauth_id,
              pm_name: proposal.proj_req_proj_manger,
              pm_email: proposal.proj_req_proj_manger_mail,
              pm_mobile: proposal.proj_req_proj_manger_mob
                ? proposal.proj_req_proj_manger_mob.toString()
                : null,
              created_at: new Date(proposal.created),
              oid: proposal.id,
            },
          });
          console.log(
            `proposal: ${createdProposal.id} created, for user ${createdProposal.submitter_user_id}`,
          );
        }
      },
      {
        timeout: 50000,
      },
    );
  }
}
