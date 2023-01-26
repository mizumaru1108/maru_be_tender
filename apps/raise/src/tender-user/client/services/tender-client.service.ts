import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ICurrentUser } from '../../../user/interfaces/current-user.interface';

import { ConfigService } from '@nestjs/config';
import { bank_information, client_data, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AllowedFileType } from '../../../commons/enums/allowed-filetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { RegisterTenderDto } from '../../../tender-auth/dtos/requests/register-tender.dto';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { TenderUserRepository } from '../../user/repositories/tender-user.repository';
import { UserStatusEnum } from '../../user/types/user_status';
import { ClientEditRequestFieldDto } from '../dtos/requests/client-edit-request-field.dto';
import { ExistingClientBankInformation } from '../dtos/requests/existing-bank-information.dto';
import { SearchEditRequestFilter } from '../dtos/requests/search-edit-request-filter-request.dto';
import { BankInformationsMapper } from '../mappers/bank_information.mapper';
import { CreateClientMapper } from '../mappers/create-client.mapper';
import { UserClientDataMapper } from '../mappers/user-client-data.mapper';
import { TenderClientRepository } from '../repositories/tender-client.repository';
import { EditRequestByIdDto } from '../dtos/requests/edit-request-by-id.dto';
import { ApproveEditRequestMapper } from '../mappers/approve-edit-request.mapper';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { RejectEditRequestDto } from '../dtos/requests/reject-edit-request.dto';
@Injectable()
export class TenderClientService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderClientService.name,
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private tenderUserRepository: TenderUserRepository,
    private tenderClientRepository: TenderClientRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async getUserTrack(userId: string): Promise<string | null> {
    try {
      const track = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          employee_path: true,
        },
      });
      return track?.employee_path || null;
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(error);
    }
  }

  // create user and it's relation to client_data table by user_id in client_data table
  async createUserAndClient(
    idFromFusionAuth: string,
    request: RegisterTenderDto,
  ): Promise<any> {
    let userCreatePayload: Prisma.userCreateInput = CreateClientMapper(
      idFromFusionAuth,
      request,
    );

    const createStatusLogPayload: Prisma.user_status_logUncheckedCreateInput[] =
      [
        {
          id: uuidv4(),
          user_id: idFromFusionAuth,
          status_id: UserStatusEnum.WAITING_FOR_ACTIVATION,
        },
      ] as Prisma.user_status_logUncheckedCreateInput[];

    let bankCreatePayload:
      | Prisma.bank_informationUncheckedCreateInput
      | undefined = undefined;

    let lisceneFileObj: UploadFilesJsonbDto | undefined = undefined;
    let lisceneFileBuffer: Buffer | undefined = undefined;
    let ofdecObj: UploadFilesJsonbDto | undefined = undefined;
    let ofdecBuffer: Buffer | undefined = undefined;
    let bankCardObj: UploadFilesJsonbDto | undefined = undefined;
    let bankCardBuffer: Buffer | undefined = undefined;
    let uploadedFilePath: string[] = [];

    const maxSize: number = 1024 * 1024 * 6; // 6MB

    // make the upload file on this service into another service that can used globally on this service (diffrent case with bunny service)
    if (request.data.license_file) {
      try {
        /* liscene file */
        let lisceneFilefileName =
          request.data.license_file.fullName
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 10) +
          new Date().getTime() +
          '.' +
          request.data.license_file.fileExtension.split('/')[1];

        let lisceneFilePath = `tmra/${this.appEnv}/organization/tender-management/client-data/${idFromFusionAuth}/liscene-file/${lisceneFilefileName}`;

        lisceneFileBuffer = Buffer.from(
          request.data.license_file.base64Data.replace(/^data:.*;base64,/, ''),
          'base64',
        );

        validateAllowedExtension(request.data.license_file.fileExtension, [
          AllowedFileType.JPG,
          AllowedFileType.JPEG,
          AllowedFileType.PNG,
          AllowedFileType.PDF,
        ]);
        validateFileSize(request.data.license_file.size, maxSize);

        const imageUrl = await this.bunnyService.uploadFileBase64(
          request.data.license_file.fullName,
          lisceneFileBuffer,
          lisceneFilePath,
          `Uploading liscene file for user ${idFromFusionAuth}`,
        );

        uploadedFilePath.push(imageUrl);
        lisceneFileObj = {
          url: imageUrl,
          type: request.data.license_file.fileExtension,
          size: request.data.license_file.size,
        };
      } catch (error) {
        this.logger.error('Error while uploading liscene file: ' + error);
        this.logger.log('log', 'deleting fusion auth user');
        await this.fusionAuthService.fusionAuthDeleteUser(idFromFusionAuth);
        this.logger.log(
          'log',
          'deleting all uploaded files before this file upload',
        );
        if (uploadedFilePath.length > 0) {
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw error;
      }
    }

    if (request.data.board_ofdec_file) {
      try {
        /* ofdec files */
        let ofdecfileName =
          request.data.board_ofdec_file.fullName
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 10) +
          new Date().getTime() +
          '.' +
          request.data.board_ofdec_file.fileExtension.split('/')[1];

        let ofdecPath = `tmra/${this.appEnv}/organization/tender-management/client-data/${idFromFusionAuth}/ofdec-file/${ofdecfileName}`;

        ofdecBuffer = Buffer.from(
          request.data.board_ofdec_file.base64Data.replace(
            /^data:.*;base64,/,
            '',
          ),
          'base64',
        );

        validateAllowedExtension(request.data.board_ofdec_file.fileExtension, [
          AllowedFileType.JPG,
          AllowedFileType.JPEG,
          AllowedFileType.PNG,
          AllowedFileType.PDF,
          AllowedFileType.DOC,
          AllowedFileType.DOCX,
          AllowedFileType.XLS,
          AllowedFileType.XLSX,
          AllowedFileType.PPT,
          AllowedFileType.PPTX,
        ]);
        validateFileSize(request.data.board_ofdec_file.size, maxSize);

        const imageUrl = await this.bunnyService.uploadFileBase64(
          request.data.board_ofdec_file.fullName,
          ofdecBuffer,
          ofdecPath,
          `Uploading board ofdec file from user ${idFromFusionAuth}`,
        );

        uploadedFilePath.push(imageUrl);
        ofdecObj = {
          url: imageUrl,
          type: request.data.board_ofdec_file.fileExtension,
          size: request.data.board_ofdec_file.size,
        };
      } catch (error) {
        this.logger.error('Error while uploading board ofdec file: ' + error);
        this.logger.log('log', 'deleting fusion auth user');
        await this.fusionAuthService.fusionAuthDeleteUser(idFromFusionAuth);
        this.logger.log(
          'log',
          'deleting all uploaded files before this file upload',
        );
        if (uploadedFilePath.length > 0) {
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw error;
      }
    }

    if (request.data.bank_informations) {
      try {
        /* ofdec files */
        let bankCardfileName =
          request.data.bank_informations.card_image.fullName
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 10) +
          new Date().getTime() +
          '.' +
          request.data.bank_informations.card_image.fileExtension.split('/')[1];

        let bankCardPath = `tmra/${this.appEnv}/organization/tender-management/client-data/${idFromFusionAuth}/bank-info/${bankCardfileName}`;

        bankCardBuffer = Buffer.from(
          request.data.bank_informations.card_image.base64Data.replace(
            /^data:.*;base64,/,
            '',
          ),
          'base64',
        );

        validateAllowedExtension(
          request.data.bank_informations.card_image.fileExtension,
          [AllowedFileType.JPG, AllowedFileType.JPEG, AllowedFileType.PNG],
        );
        validateFileSize(
          request.data.bank_informations.card_image.size,
          maxSize,
        );

        const imageUrl = await this.bunnyService.uploadFileBase64(
          request.data.bank_informations.card_image.fullName,
          bankCardBuffer,
          bankCardPath,
          `Uploading bank card file from user ${idFromFusionAuth}`,
        );

        uploadedFilePath.push(imageUrl);
        bankCardObj = {
          url: imageUrl,
          type: request.data.bank_informations.card_image.fileExtension,
          size: request.data.bank_informations.card_image.size,
        };
      } catch (error) {
        this.logger.error('Error while uploading bank card file: ' + error);
        this.logger.log('log', 'deleting fusion auth user');
        await this.fusionAuthService.fusionAuthDeleteUser(idFromFusionAuth);
        this.logger.log(
          'log',
          'deleting all uploaded files before this file upload',
        );
        if (uploadedFilePath.length > 0) {
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw error;
      }

      bankCreatePayload = BankInformationsMapper(
        idFromFusionAuth,
        request.data.bank_informations,
        bankCardObj,
      );
    }

    userCreatePayload = UserClientDataMapper(
      userCreatePayload,
      request,
      lisceneFileObj,
      ofdecObj,
    );

    // console.log(
    //   'userCreatePayload',
    //   JSON.stringify(userCreatePayload, null, 2),
    // );

    const createdUser = await this.tenderUserRepository.createUser(
      userCreatePayload,
      createStatusLogPayload,
      undefined,
      bankCreatePayload,
      uploadedFilePath,
    );

    return {
      createdUser: createdUser instanceof Array ? createdUser[0] : createdUser,
    };
  }

  async findMyPendingLogCount(user_id: string) {
    const total = await this.tenderClientRepository.countMyPendingLogs(user_id);
    return {
      dataCount: total,
    };
  }

  async uploadClientFile(
    userId: string,
    uploadMessage: string,
    file: TenderFilePayload,
    folderName: string,
    AllowedFileTypes: AllowedFileType[],
    maxSize: number = 1024 * 1024 * 6,
    uploadedFilePath: string[],
  ) {
    try {
      let fileName =
        file.fullName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) +
        new Date().getTime() +
        '.' +
        file.fileExtension.split('/')[1];

      let filePath = `tmra/${this.appEnv}/organization/tender-management/client-data/${userId}/${folderName}/${fileName}`;

      let fileBuffer = Buffer.from(
        file.base64Data.replace(/^data:.*;base64,/, ''),
        'base64',
      );

      validateAllowedExtension(file.fileExtension, AllowedFileTypes);
      validateFileSize(file.size, maxSize);

      const imageUrl = await this.bunnyService.uploadFileBase64(
        file.fullName,
        fileBuffer,
        filePath,
        `${uploadMessage} ${userId}`,
      );

      uploadedFilePath.push(imageUrl);
      let fileObj = {
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
          'log',
          `${uploadMessage} error, deleting all previous uploaded files: ${error}`,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      throw new InternalServerErrorException(`${uploadMessage} error`);
    }
  }

  sanitizeEditRequest(oldData: ClientEditRequestFieldDto) {
    delete oldData.created_banks;
    delete oldData.deleted_banks;
    delete oldData.updated_banks;
    delete oldData.old_banks;
    return oldData;
  }

  valueParser(type: string, newValue: string) {
    if (type === 'number') return Number(newValue);
    if (type === 'object') return JSON.parse(newValue);
    if (type === 'date') return new Date(newValue);
    return newValue;
  }

  async findEditRequestByLogId(request_id: string) {
    const log = await this.tenderClientRepository.findEditRequestLogByRequestId(
      request_id,
    );
    if (!log) throw new NotFoundException('Edit Request Not Found!');

    const old_data = JSON.parse(log.old_value);
    const new_data = JSON.parse(log.new_value);

    delete new_data.createdBanks;
    delete new_data.updatedBanks;
    delete new_data.deletedBanks;

    const diffrence = ApproveEditRequestMapper(old_data, new_data);

    return {
      old_data,
      new_data,
      diffrence,
    };
  }

  async findEditRequests(request: SearchEditRequestFilter) {
    const response = await this.tenderClientRepository.findEditRequests(
      request,
    );
    return response;
  }

  async createEditRequest(
    user: ICurrentUser,
    editRequest: ClientEditRequestFieldDto,
  ): Promise<any> {
    let uploadedFilePath: string[] = [];

    try {
      const { created_banks, updated_banks, deleted_banks, old_banks } =
        editRequest;
      const clientData =
        await this.tenderClientRepository.findClientDataByUserId(user.id);
      if (!clientData) throw new NotFoundException('Client data not found!');

      if (clientData.user.status_id !== 'ACTIVE_ACCOUNT') {
        throw new BadRequestException(
          'User have to be ACTIVE to perform an edit request!',
        );
      }

      const pendingLogs = await this.tenderClientRepository.countMyPendingLogs(
        user.id,
      );
      if (pendingLogs > 0) {
        throw new BadRequestException(
          'You are not allowed to ask another request untill accounts manager already responded to your previous request!',
        );
      }

      // excluding some prop from client data
      const exclude = ['user', 'id'];
      const newClientDataObject = Object.fromEntries(
        Object.entries(clientData).filter(([k]) => !exclude.includes(k)),
      );

      let tmp = {
        ...newClientDataObject,
        bank_information: old_banks,
      } as ClientEditRequestFieldDto;

      const fullPayloadRequest = this.sanitizeEditRequest(tmp);
      const createdBankInfo: ExistingClientBankInformation[] = [];
      const updatedBankInfo: ExistingClientBankInformation[] = [];
      const deletedBankInfo: ExistingClientBankInformation[] = [];

      let fullPayloadFinal = this.sanitizeEditRequest(editRequest);

      let baseNewEditRequest = {
        id: uuidv4(),
        user_id: user.id,
        status_id: 'PENDING',
      };
      let newEditRequest: Prisma.edit_requestsUncheckedCreateInput | undefined =
        undefined;

      const maxSize: number = 1024 * 1024 * 6; // 6MB

      const newBankInfo: ExistingClientBankInformation[] = [];

      if (old_banks && old_banks.length > 0) {
        newBankInfo.push(...old_banks);

        if (updated_banks && updated_banks.length > 0) {
          for (let i = 0; i < updated_banks.length; i++) {
            const idx = newBankInfo.findIndex(
              (value) => value.id === updated_banks[i].id,
            );
            const oldData = newBankInfo[idx];

            let cardImage = {
              ...oldData.card_image,
            };

            // uploading if the image of the bank changed
            if (isTenderFilePayload(updated_banks[i].card_image)) {
              const uploadResult = await this.uploadClientFile(
                user.id,
                'Uploading bank card image for user',
                updated_banks[i].card_image,
                'bank-info',
                [
                  AllowedFileType.JPG,
                  AllowedFileType.JPEG,
                  AllowedFileType.PNG,
                ],
                maxSize,
                uploadedFilePath,
              );

              uploadedFilePath = uploadResult.uploadedFilePath;
              cardImage = uploadResult.fileObj;
            }

            let newData: Prisma.bank_informationUncheckedCreateInput = {
              id: oldData.id,
              user_id: user.id,
              bank_account_name:
                updated_banks[i].bank_account_name !== oldData.bank_account_name
                  ? updated_banks[i].bank_account_name
                  : oldData.bank_account_name,
              bank_account_number:
                updated_banks[i].bank_account_number !==
                oldData.bank_account_number
                  ? updated_banks[i].bank_account_number
                  : oldData.bank_account_number,
              bank_name:
                updated_banks[i].bank_name !== oldData.bank_name
                  ? updated_banks[i].bank_name
                  : oldData.bank_name,
              card_image: cardImage,
            };

            newBankInfo[idx] = newData as any;
            updatedBankInfo.push(newData as any);
          }
        }

        if (deleted_banks && deleted_banks.length > 0) {
          for (let i = 0; i < deleted_banks.length; i++) {
            const idx = newBankInfo.findIndex(
              (value) => value.id === deleted_banks[i].id,
            );

            deletedBankInfo.push(newBankInfo[i]);
            newBankInfo.splice(idx, 1);
          }
        }

        if (created_banks && created_banks.length > 0) {
          for (let i = 0; i < created_banks.length; i++) {
            const uploadResult = await this.uploadClientFile(
              user.id,
              'Uploading bank card image for user',
              created_banks[i].card_image,
              'bank-info',
              [AllowedFileType.JPG, AllowedFileType.JPEG, AllowedFileType.PNG],
              maxSize,
              uploadedFilePath,
            );

            uploadedFilePath = uploadResult.uploadedFilePath;

            newBankInfo.push({
              id: uuidv4(),
              user_id: user.id,
              bank_name: created_banks[i].bank_name,
              bank_account_name: created_banks[i].bank_account_name,
              bank_account_number: created_banks[i].bank_account_number,
              card_image: uploadResult.fileObj,
            });

            createdBankInfo.push({
              id: uuidv4(),
              user_id: user.id,
              bank_name: created_banks[i].bank_name,
              bank_account_name: created_banks[i].bank_account_name,
              bank_account_number: created_banks[i].bank_account_number,
              card_image: uploadResult.fileObj,
            });
          }
        }

        fullPayloadRequest['bank_information'] = old_banks;
        fullPayloadFinal['bank_information'] = newBankInfo;
        fullPayloadFinal = {
          ...fullPayloadFinal,
          createdBanks: [...createdBankInfo],
          updatedBanks: [...updatedBankInfo],
          deletedBanks: deleted_banks,
        };
      }

      newEditRequest = {
        ...baseNewEditRequest,
        old_value: JSON.stringify(fullPayloadRequest),
        new_value: JSON.stringify(fullPayloadFinal),
      };

      const response = await this.tenderClientRepository.createUpdateRequest(
        newEditRequest,
      );

      return response;
    } catch (error) {
      if (uploadedFilePath.length > 0) {
        this.logger.log(
          'log',
          `Error occured during edit request, deleting all previous uploaded files: ${error}`,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      throw error;
    }
  }

  async acceptEditRequests(reviewerId: string, requestId: string) {
    const requestData =
      await this.tenderClientRepository.findEditRequestLogByRequestId(
        requestId,
      );

    if (!requestData) {
      throw new BadRequestException('No Request Data Found!');
    }

    let old_data: client_data;
    let new_data: client_data;
    let updateClientPayload: Prisma.client_dataUncheckedUpdateInput | undefined;
    let created_bank: Prisma.bank_informationCreateManyInput[] = [];
    let updated_bank: bank_information[] = [];
    let deleted_bank: bank_information[] = [];

    try {
      const { old_value, new_value, user_id } = requestData;

      let oldTmp = JSON.parse(old_value);
      delete oldTmp.bank_information;
      old_data = oldTmp;

      let newTmp = JSON.parse(new_value);
      created_bank = newTmp['createdBanks'];
      updated_bank = newTmp['updatedBanks'];
      deleted_bank = newTmp['deletedBanks'];

      delete newTmp.bank_information;
      delete newTmp.createdBanks;
      delete newTmp.updatedBanks;
      delete newTmp.deletedBanks;
      new_data = newTmp;

      updateClientPayload = ApproveEditRequestMapper(old_data, new_data);

      const response = await this.tenderClientRepository.approveEditRequests(
        requestId,
        reviewerId,
        user_id,
        updateClientPayload,
        created_bank,
        updated_bank,
        deleted_bank,
      );

      return response;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientService.name,
        'Approving Edit Requests!',
        'Approving Edit Requests!',
      );
      throw theError;
    }
  }

  async rejectEditRequests(reviewer_id: string, request: RejectEditRequestDto) {
    const requestData =
      await this.tenderClientRepository.findEditRequestLogByRequestId(
        request.requestId,
      );
    if (!requestData) {
      throw new BadRequestException('No Request Data Found!');
    }
    try {
      const updatePayload: Prisma.edit_requestsUncheckedUpdateInput = {
        status_id: 'REJECTED',
        reject_reason: request.reject_reason,
        rejected_at: new Date(),
        reviewer_id,
      };

      await this.tenderClientRepository.updateById(
        request.requestId,
        updatePayload,
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientService.name,
        'Approving Edit Requests!',
        'Approving Edit Requests!',
      );
      throw theError;
    }
  }
}
