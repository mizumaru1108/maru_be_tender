import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { file_manager, Prisma } from '@prisma/client';
import { FileMimeTypeEnum } from '../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../commons/utils/validate-allowed-extension';
import { validateFileUploadSize } from '../../commons/utils/validate-file-size';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { TenderFilePayload } from '../../tender-commons/dto/tender-file-payload.dto';
import { generateFileName } from '../../tender-commons/utils/generate-filename';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { ProposalService } from '../../proposal-management/proposal/services/proposal.service';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import { FetchFileManagerFilter } from '../dtos/requests';
import { CreateNewFileHistoryDto } from '../dtos/requests/create-new-file-history.dto';
import { CreateManyNewFileHistoryMapper } from '../mappers/create-many-new-file-history';
import { CreateNewFileHistoryMapper } from '../mappers/create-new-file-history';
import { TenderFileManagerRepository } from '../repositories/tender-file-manager.repository';

@Injectable()
export class TenderFileManagerService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderFileManagerService.name,
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly bunnyService: BunnyService,
    private readonly fileManagerRepo: TenderFileManagerRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async create(userId: string, payload: CreateNewFileHistoryDto) {
    const createPayload: Prisma.file_managerUncheckedCreateInput =
      CreateNewFileHistoryMapper(userId, payload);

    const createdFileManager = await this.fileManagerRepo.createFileManager(
      createPayload,
    );
    return createdFileManager;
  }

  async createMany(userId: string, payload: CreateNewFileHistoryDto[]) {
    const createPayloads: Prisma.file_managerCreateManyInput[] =
      CreateManyNewFileHistoryMapper(userId, payload);

    const createdFileManagers =
      await this.fileManagerRepo.createManyFileManager(createPayloads);

    return createdFileManagers;
  }

  async findByUrl(fileUrl: string): Promise<file_manager | null> {
    const file = await this.fileManagerRepo.findByUrl(fileUrl);
    return file;
  }

  async fetchAll(
    currentUser: TenderCurrentUser,
    filter: FetchFileManagerFilter,
  ) {
    return await this.fileManagerRepo.fetchAll(currentUser, filter);
  }

  // on proposal service
  // async uploadProposalFileIntercept(
  //   userId: string,
  //   proposalId: string,
  //   uploadMessage: string,
  //   file: Express.Multer.File,
  //   folderName: string,
  //   AllowedFileTypes: FileMimeTypeEnum[],
  //   maxSize: number = 1024 * 1024 * 4,
  //   uploadedFilePath: string[],
  // ) {
  //   try {
  //     const fileName = generateFileName(
  //       file.originalname,
  //       file.mimetype as FileMimeTypeEnum,
  //     );

  //     const filePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposalId}/${userId}/${folderName}/${fileName}`;

  //     validateAllowedExtension(file.mimetype, AllowedFileTypes);
  //     validateFileSize(file.size, maxSize);

  //     const imageUrl = await this.bunnyService.uploadFileMulter(
  //       file,
  //       filePath,
  //       `${uploadMessage} ${userId}`,
  //     );

  //     uploadedFilePath.push(imageUrl);
  //     const fileObj = {
  //       url: imageUrl,
  //       type: file.mimetype,
  //       size: file.size,
  //     };

  //     return {
  //       uploadedFilePath,
  //       fileObj,
  //     };
  //   } catch (error) {
  //     if (uploadedFilePath.length > 0) {
  //       this.logger.log(
  //         'info',
  //         `${uploadMessage} error, deleting all previous uploaded files: ${error}`,
  //       );
  //       uploadedFilePath.forEach(async (path) => {
  //         await this.bunnyService.deleteMedia(path, true);
  //       });
  //     }
  //     const theError = prismaErrorThrower(
  //       error,
  //       TenderProposalService.name,
  //       `${uploadMessage}, error:`,
  //       `${uploadMessage}`,
  //     );
  //     throw theError;
  //   }
  // }
  async uploadAndCreateFileManager(userId: string, path: string) {
    try {
    } catch (error) {}
  }

  async uploadBase64AndCreateFileManager(userId: string, path: string) {
    try {
    } catch (error) {}
  }

  // on client data
  // try {

  //   const filePath = `tmra/${this.appEnv}/organization/tender-management/client-data/${userId}/${folderName}/${fileName}`;

  //   const fileBuffer = Buffer.from(
  //     file.base64Data.replace(/^data:.*;base64,/, ''),
  //     'base64',
  //   );

  //   validateAllowedExtension(file.fileExtension, AllowedFileTypes);
  //   validateFileSize(file.size, maxSize);

  //   const imageUrl = await this.bunnyService.uploadFileBase64(
  //     file.fullName,
  //     fileBuffer,
  //     filePath,
  //     `${uploadMessage} ${userId}`,
  //   );

  //   uploadedFilePath.push(imageUrl);
  //   const fileObj = {
  //     url: imageUrl,
  //     type: file.fileExtension,
  //     size: file.size,
  //   };

  //   return {
  //     uploadedFilePath,
  //     fileObj,
  //   };
  // } catch (error) {
  //   if (uploadedFilePath.length > 0) {
  //     this.logger.log(
  //       'log',
  //       `${uploadMessage} error, deleting all previous uploaded files: ${error}`,
  //     );
  //     uploadedFilePath.forEach(async (path) => {
  //       await this.bunnyService.deleteMedia(path, true);
  //     });
  //   }
  //   if (onCreateUser && userId) {
  //     this.logger.log(
  //       'info',
  //       `Falied to store user data on db, deleting the user ${userId} from fusion auth`,
  //     );
  //     await this.fusionAuthService.fusionAuthDeleteUser(userId);
  //   }
  //   const theError = prismaErrorThrower(
  //     error,
  //     TenderClientService.name,
  //     `${uploadMessage}, error:`,
  //     `${uploadMessage}`,
  //   );
  //   throw theError;
  // }

  async uploadProposalFile(
    userId: string,
    proposalId: string,
    uploadMessage: string,
    file: TenderFilePayload,
    folderName: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 4,
    uploadedFilePath: string[],
  ) {
    try {
      const fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

      const filePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposalId}/${userId}/${folderName}/${fileName}`;

      const fileBuffer = Buffer.from(
        file.base64Data.replace(/^data:.*;base64,/, ''),
        'base64',
      );

      validateAllowedExtension(file.fileExtension, AllowedFileTypes);
      validateFileUploadSize(file.size, maxSize);

      const imageUrl = await this.bunnyService.uploadFileBase64(
        file.fullName,
        fileBuffer,
        filePath,
        `${uploadMessage} ${userId}`,
      );

      uploadedFilePath.push(imageUrl);
      const fileObj = {
        url: imageUrl,
        type: file.fileExtension,
        size: file.size,
      };

      return {
        uploadedFilePath,
        fileObj,
      };
    } catch (error) {
      if (uploadedFilePath.length > 0) {
        this.logger.log(
          'info',
          `${uploadMessage} error, deleting all previous uploaded files: ${error}`,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      const theError = prismaErrorThrower(
        error,
        ProposalService.name,
        `${uploadMessage}, error:`,
        `${uploadMessage}`,
      );
      throw theError;
    }
  }
}
