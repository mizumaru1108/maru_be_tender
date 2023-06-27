import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenderFileManagerRepository } from '../../../tender-file-manager/repositories/tender-file-manager.repository';
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
    private readonly bunnyService: BunnyService,
    private readonly fileManagerRepo: TenderFileManagerRepository,
    @InjectPinoLogger(TenderProposalRepository.name) private logger: PinoLogger,
  ) {}

  async execute(command: QaProposalDeleteCommand): Promise<any> {
    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        const fileManagers = await this.fileManagerRepo.findMany(
          {
            proposal_id: command.id,
          },
          session,
        );

        if (fileManagers) {
          for (const fileManager of fileManagers) {
            await this.bunnyService.deleteMedia(fileManager.url, true);
            await this.fileManagerRepo.delete(
              { url: fileManager.url },
              session,
            );
          }
        }

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
