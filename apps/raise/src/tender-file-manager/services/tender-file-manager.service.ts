import { Injectable } from '@nestjs/common';
import { file_manager, Prisma } from '@prisma/client';
import { CreateNewFileHistoryDto } from '../dtos/requests/create-new-file-history.dto';
import { CreateManyNewFileHistoryMapper } from '../mappers/create-many-new-file-history';
import { CreateNewFileHistoryMapper } from '../mappers/create-new-file-history';
import { TenderFileManagerRepository } from '../repositories/tender-file-manager.repository';

@Injectable()
export class TenderFileManagerService {
  constructor(
    private readonly TenderFileManagerRepository: TenderFileManagerRepository,
  ) {}

  async create(userId: string, payload: CreateNewFileHistoryDto) {
    const createPayload: Prisma.file_managerUncheckedCreateInput =
      CreateNewFileHistoryMapper(userId, payload);

    const createdFileManager = await this.TenderFileManagerRepository.create(
      createPayload,
    );
    return createdFileManager;
  }

  async createMany(userId: string, payload: CreateNewFileHistoryDto[]) {
    const createPayloads: Prisma.file_managerCreateManyInput[] =
      CreateManyNewFileHistoryMapper(userId, payload);

    const createdFileManagers =
      await this.TenderFileManagerRepository.createMany(createPayloads);

    return createdFileManagers;
  }

  async findByUrl(fileUrl: string): Promise<file_manager | null> {
    const file = await this.TenderFileManagerRepository.findByUrl(fileUrl);
    return file;
  }
}
