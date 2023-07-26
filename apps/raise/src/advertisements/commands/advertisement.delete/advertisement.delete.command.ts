import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import { AdvertisementRepository } from 'src/advertisements/repositories/advertisement.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { FileManagerEntity } from 'src/tender-file-manager/entities/file-manager.entity';
import { TenderFileManagerRepository } from 'src/tender-file-manager/repositories/tender-file-manager.repository';
export class AdvertisementDeleteCommand {
  id: string;
}

export class AdvertisementDeleteCommandResult {
  @ApiProperty()
  deleted_advertisement: AdvertisementEntity;

  @ApiProperty()
  marked_delete_files: FileManagerEntity[];
}

@CommandHandler(AdvertisementDeleteCommand)
export class AdvertisementDeleteCommandHandler
  implements
    ICommandHandler<
      AdvertisementDeleteCommand,
      AdvertisementDeleteCommandResult
    >
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly adsRepo: AdvertisementRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
  ) {}

  async execute(
    command: AdvertisementDeleteCommand,
  ): Promise<AdvertisementDeleteCommandResult> {
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
