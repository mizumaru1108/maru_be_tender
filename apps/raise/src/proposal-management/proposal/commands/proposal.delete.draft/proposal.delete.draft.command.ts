import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { isUploadFileJsonb } from '../../../../tender-commons/utils/is-upload-file-jsonb';
import { ProposalEntity } from '../../entities/proposal.entity';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { TenderFileManagerRepository } from '../../../../tender-file-manager/repositories/tender-file-manager.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
export class ProposalDeleteDraftCommand {
  user_id: string;
  proposal_id: string;
}

export class ProposalDeleteDraftCommandResult {
  data: ProposalEntity;
}

@CommandHandler(ProposalDeleteDraftCommand)
export class ProposalDeleteDraftCommandHandler
  implements
    ICommandHandler<
      ProposalDeleteDraftCommand,
      ProposalDeleteDraftCommandResult
    >
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: ProposalRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
  ) {}

  async execute(
    command: ProposalDeleteDraftCommand,
  ): Promise<ProposalDeleteDraftCommandResult> {
    const { user_id, proposal_id } = command;
    try {
      const deletedFileManagerUrls: string[] = []; // id of file manager that we want to mark as soft delete.

      const proposal = await this.proposalRepo.fetchById({ id: proposal_id });
      if (!proposal) throw new BadRequestException('Proposal not found');

      if (proposal.submitter_user_id !== user_id) {
        throw new BadRequestException(
          'User not authorized to delete this proposal',
        );
      }

      if (proposal.step === 'ZERO') {
        throw new BadRequestException(
          "You can't delete this proposal, it wasn't a draft!",
        );
      }

      if (isUploadFileJsonb(proposal.project_attachments)) {
        const oldFile = proposal.project_attachments as {
          url: string;
          type: string;
          size: number;
        };
        if (!!oldFile.url) {
          deletedFileManagerUrls.push(oldFile.url);
        }
      }

      if (isUploadFileJsonb(proposal.letter_ofsupport_req)) {
        const oldFile = proposal.letter_ofsupport_req as {
          url: string;
          type: string;
          size: number;
        };
        if (!!oldFile.url) {
          deletedFileManagerUrls.push(oldFile.url);
        }
      }

      const dbRes = await this.prismaService.$transaction(async (session) => {
        const tx =
          session instanceof PrismaService ? session : this.prismaService;

        if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
          await this.fileManagerRepo.updateMany(
            {
              url: deletedFileManagerUrls,
              is_deleted: true,
            },
            tx,
          );
        }

        const deletedProposal = await this.proposalRepo.delete(
          { id: proposal_id },
          tx,
        );

        return deletedProposal;
      });

      return {
        data: dbRes,
      };
    } catch (error) {
      throw error;
    }
  }
}
