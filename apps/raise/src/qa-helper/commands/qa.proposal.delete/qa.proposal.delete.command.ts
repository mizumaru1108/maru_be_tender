import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenderProposalRepository } from '../../../tender-proposal/tender-proposal/repositories/tender-proposal.repository';

export class QaProposalDeleteCommand {
  id: string;
}

@CommandHandler(QaProposalDeleteCommand)
export class QaProposalDeleteCommandHandler
  implements ICommandHandler<QaProposalDeleteCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: TenderProposalRepository,
    @InjectPinoLogger(TenderProposalRepository.name) private logger: PinoLogger,
  ) {}
  async execute(command: QaProposalDeleteCommand): Promise<any> {
    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        const deletedProposal = await this.proposalRepo.delete(
          {
            id: command.id,
          },
          session,
        );

        return deletedProposal;
      });
    } catch (error: any) {
      console.trace({ error });
      this.logger.error(`QaProposalDeleteCommand error ${error}`);
      throw error;
    }
  }
}
