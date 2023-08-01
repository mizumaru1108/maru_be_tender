import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { BannerEntity } from 'src/banners/entities/banner.entity';
import { BannerRepository } from 'src/banners/repositories/banner.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { FileManagerEntity } from 'src/tender-file-manager/entities/file-manager.entity';
import { TenderFileManagerRepository } from 'src/tender-file-manager/repositories/tender-file-manager.repository';
export class BannerDeleteCommand {
  id: string;
}

export class BannerDeleteCommandResult {
  @ApiProperty()
  deleted_advertisement: BannerEntity;

  @ApiProperty()
  marked_delete_files: FileManagerEntity[];
}

@CommandHandler(BannerDeleteCommand)
export class BannerDeleteCommandHandler
  implements ICommandHandler<BannerDeleteCommand, BannerDeleteCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly adsRepo: BannerRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
  ) {}

  async execute(
    command: BannerDeleteCommand,
  ): Promise<BannerDeleteCommandResult> {
    const { id } = command;
    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        const ads = await this.adsRepo.findById(id, session);

        if (!ads) {
          throw new DataNotFoundException(`Ads with id of ${id} not found!`);
        }

        const files = await this.fileManagerRepo.findMany(
          {
            advertisement_id: id,
            column_name: 'logo',
            table_name: 'advertisements',
          },
          session,
        );

        if (files.length > 0) {
          for (const file of files) {
            await this.fileManagerRepo.update(
              { url: file.url, is_deleted: true },
              session,
            );
          }
        }

        const deletedAds = await this.adsRepo.delete(id, session);

        return {
          deleted_advertisement: deletedAds,
          marked_delete_files: files,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
