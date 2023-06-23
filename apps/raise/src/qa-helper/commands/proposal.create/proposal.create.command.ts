import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma/prisma.service';

export class ProposalCreateCommand {}

@CommandHandler(ProposalCreateCommand)
export class ProposalCreateCommandHandler
  implements ICommandHandler<ProposalCreateCommand>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: ProposalCreateCommand): Promise<any> {
    try {
      return await this.prismaService.$transaction(async (session) => {});
    } catch (error) {
      throw error;
    }
  }
}
