import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import { AdvertisementRepository } from 'src/advertisements/repositories/advertisement.repository';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
export class AdvertisementUpdateCommand {
  id: string;
  content?: string;
  title?: string;
  track_id?: string;
  type?: AdvertisementTypeEnum;
  date?: Date;
  start_time?: string;
}

export class AdvertisementUpdateCommandResult {
  advertisement: AdvertisementEntity;
}

@CommandHandler(AdvertisementUpdateCommand)
export class AdvertisementUpdateHandler
  implements
    ICommandHandler<
      AdvertisementUpdateCommand,
      AdvertisementUpdateCommandResult
    >
{
  constructor(private readonly adsRepo: AdvertisementRepository) {}

  async execute(
    command: AdvertisementUpdateCommand,
  ): Promise<AdvertisementUpdateCommandResult> {
    const res = await this.adsRepo.update({
      id: command.id,
      content: command.content,
      title: command.title,
      type: command.type,
      track_id: command.track_id,
      date: command.date,
      start_time: command.start_time,
    });

    return {
      advertisement: res,
    };
  }
}
