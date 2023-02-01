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
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../../libs/email/email.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { TwilioService } from '../../../libs/twilio/services/twilio.service';
import { RegisterTenderDto } from '../../../tender-auth/dtos/requests/register-tender.dto';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import { isTenderFilePayload } from '../../../tender-commons/utils/is-tender-file-payload';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';
import { TenderUserRepository } from '../../user/repositories/tender-user.repository';
import { UserStatusEnum } from '../../user/types/user_status';
import { ClientEditRequestFieldDto } from '../dtos/requests/client-edit-request-field.dto';
import { ExistingClientBankInformation } from '../dtos/requests/existing-bank-information.dto';
import { RejectEditRequestDto } from '../dtos/requests/reject-edit-request.dto';
import { SearchEditRequestFilter } from '../dtos/requests/search-edit-request-filter-request.dto';
import { RawCreateEditRequestResponse } from '../dtos/responses/raw-create-edit-request-response.dto';
import { RawResponseEditRequestDto } from '../dtos/responses/raw-response-edit-request-response.dto';
import { ApproveEditRequestMapper } from '../mappers/approve-edit-request.mapper';
import { BankInformationsMapper } from '../mappers/bank_information.mapper';
import { CreateClientMapper } from '../mappers/create-client.mapper';
import { UserClientDataMapper } from '../mappers/user-client-data.mapper';
import { TenderClientRepository } from '../repositories/tender-client.repository';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';
import { isUploadFileJsonb } from '../../../tender-commons/utils/is-upload-file-jsonb';
import { finalUploadFileJson } from '../types';
import { logUtil } from '../../../commons/utils/log-util';
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
    private readonly emailService: EmailService,
    private readonly notificationService: TenderNotificationService,
    private readonly twilioService: TwilioService,
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
    let ofdecObj: UploadFilesJsonbDto[] = [];
    let bankCardObj: UploadFilesJsonbDto | undefined = undefined;
    let uploadedFilePath: string[] = [];
    const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
      [];

    const maxSize: number = 1024 * 1024 * 8; // 8MB

    // make the upload file on this service into another service that can used globally on this service (diffrent case with bunny service)
    if (request.data.license_file) {
      const uploadResult = await this.uploadClientFile(
        idFromFusionAuth,
        'Uploading Liscene File for user',
        request.data.license_file,
        'license-file',
        [
          FileMimeTypeEnum.JPG,
          FileMimeTypeEnum.JPEG,
          FileMimeTypeEnum.PNG,
          FileMimeTypeEnum.PDF,
        ],
        maxSize,
        uploadedFilePath,
      );
      uploadedFilePath = [...uploadResult.uploadedFilePath];

      lisceneFileObj = uploadResult.fileObj;

      const payload: Prisma.file_managerUncheckedCreateInput = {
        id: uuidv4(),
        user_id: idFromFusionAuth,
        name: uploadResult.fileObj.url.split('/').pop() as string,
        url: uploadResult.fileObj.url,
        mimetype: uploadResult.fileObj.type,
        size: uploadResult.fileObj.size,
        column_name: 'license_file',
        table_name: 'client_data',
      };
      fileManagerCreateManyPayload.push(payload);
    }

    if (request.data.board_ofdec_file) {
      const uploadResult = await this.uploadClientFile(
        idFromFusionAuth,
        'Uploading Board Ofdec File for user',
        request.data.board_ofdec_file,
        'ofdec',
        [
          FileMimeTypeEnum.JPG,
          FileMimeTypeEnum.JPEG,
          FileMimeTypeEnum.PNG,
          FileMimeTypeEnum.PDF,
          FileMimeTypeEnum.DOC,
          FileMimeTypeEnum.DOCX,
          FileMimeTypeEnum.XLS,
          FileMimeTypeEnum.XLSX,
          FileMimeTypeEnum.PPT,
          FileMimeTypeEnum.PPTX,
        ],
        maxSize,
        uploadedFilePath,
      );
      uploadedFilePath = [...uploadResult.uploadedFilePath];

      const payload: Prisma.file_managerUncheckedCreateInput = {
        id: uuidv4(),
        user_id: idFromFusionAuth,
        name: uploadResult.fileObj.url.split('/').pop() as string,
        url: uploadResult.fileObj.url,
        mimetype: uploadResult.fileObj.type,
        size: uploadResult.fileObj.size,
        column_name: 'board_ofdec_file',
        table_name: 'client_data',
      };
      fileManagerCreateManyPayload.push(payload);

      ofdecObj.push(uploadResult.fileObj);
    }

    if (request.data.bank_informations) {
      const uploadResult = await this.uploadClientFile(
        idFromFusionAuth,
        'Uploading Board Ofdec File for user',
        request.data.board_ofdec_file,
        'bank-info',
        [FileMimeTypeEnum.JPG, FileMimeTypeEnum.JPEG, FileMimeTypeEnum.PNG],
        maxSize,
        uploadedFilePath,
      );
      uploadedFilePath = [...uploadResult.uploadedFilePath];

      bankCardObj = uploadResult.fileObj;
      bankCreatePayload = BankInformationsMapper(
        idFromFusionAuth,
        request.data.bank_informations,
        bankCardObj,
      );

      const payload: Prisma.file_managerUncheckedCreateInput = {
        id: uuidv4(),
        user_id: idFromFusionAuth,
        name: uploadResult.fileObj.url.split('/').pop() as string,
        url: uploadResult.fileObj.url,
        mimetype: uploadResult.fileObj.type,
        size: uploadResult.fileObj.size,
        column_name: 'card_image',
        table_name: 'bank_information',
        bank_information_id: bankCreatePayload.id,
      };
      fileManagerCreateManyPayload.push(payload);
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
      fileManagerCreateManyPayload,
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
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 6,
    uploadedFilePath: string[],
  ) {
    try {
      let fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

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

  async findEditRequestByLogId(request_id: string) {
    const log = await this.tenderClientRepository.findEditRequestLogByRequestId(
      request_id,
    );
    if (!log) throw new NotFoundException('Edit Request Not Found!');

    const old_data = JSON.parse(log.old_value);
    const new_data = JSON.parse(log.new_value);

    const tmpDiffrence = ApproveEditRequestMapper(old_data, new_data);

    let diffrence = {
      ...tmpDiffrence,
    };

    if (old_data.bank_information && old_data.bank_information.length > 0) {
      for (let i = 0; i < old_data.bank_information.length; i++) {
        if (new_data.updatedBanks && new_data.updatedBanks.length > 0) {
          const isExist = new_data.updatedBanks.findIndex(
            (value: bank_information) =>
              value.id === old_data.bank_information[i].id,
          );
          isExist !== -1
            ? (old_data.bank_information[i]['color'] = 'blue')
            : 'transparent';
        } else {
          old_data.bank_information[i]['color'] = 'transparent';
        }

        if (new_data.deletedBanks && new_data.deletedBanks.length > 0) {
          const isExist = new_data.deletedBanks.findIndex(
            (value: bank_information) =>
              value.id === old_data.bank_information[i].id,
          );
          isExist !== -1
            ? (old_data.bank_information[i]['color'] = 'red')
            : 'transparent';
        } else {
          old_data.bank_information[i]['color'] = 'transparent';
        }
      }
    }

    if (new_data.bank_information && new_data.bank_information.length > 0) {
      for (let i = 0; i < new_data.bank_information.length; i++) {
        if (new_data.createdBanks && new_data.createdBanks.length > 0) {
          const isExist = new_data.createdBanks.findIndex(
            (value: bank_information) =>
              value.id === new_data.bank_information[i].id,
          );
          isExist === -1
            ? (new_data.bank_information[i]['color'] = 'green')
            : 'transparent';
        } else {
          new_data.bank_information[i]['color'] = 'transparent';
        }

        if (new_data.updatedBanks && new_data.updatedBanks.length > 0) {
          const isExist = new_data.updatedBanks.findIndex(
            (value: bank_information) =>
              value.id === new_data.bank_information[i].id,
          );
          isExist !== -1
            ? (new_data.bank_information[i]['color'] = 'blue')
            : 'transparent';
        } else {
          new_data.bank_information[i]['color'] = 'transparent';
        }

        if (new_data.deletedBanks && new_data.deletedBanks.length > 0) {
          const isExist = new_data.deletedBanks.findIndex(
            (value: bank_information) =>
              value.id === new_data.bank_information[i].id,
          );
          isExist !== -1
            ? (new_data.bank_information[i]['color'] = 'red')
            : 'transparent';
        } else {
          new_data.bank_information[i]['color'] = 'transparent';
        }
      }
    }

    // sanitize the new_data
    delete new_data.createdBanks;
    delete new_data.updatedBanks;
    delete new_data.deletedBanks;

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
      const {
        created_banks,
        updated_banks,
        deleted_banks,
        old_banks, // current existing bank_information that will be displayed as bank_information at the old data
        board_ofdec_file,
        license_file,
      } = editRequest;
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

      const clientOldRequest = this.sanitizeEditRequest(tmp); // client_request (old data / previous data)
      let clientNewRequest = this.sanitizeEditRequest(editRequest); // client_request (new data / data that requested to account manager to be approved)
      const createdBankInfo: ExistingClientBankInformation[] = [];
      const updatedBankInfo: ExistingClientBankInformation[] = [];
      const deletedBankInfo: ExistingClientBankInformation[] = [];

      // for creating file manager
      const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
        [];

      let baseNewEditRequest = {
        id: uuidv4(),
        user_id: user.id,
        status_id: 'PENDING',
      };

      let newEditRequest: Prisma.edit_requestsUncheckedCreateInput | undefined =
        undefined;

      const maxSize: number = 1024 * 1024 * 6; // 6MB

      // the bank_information that will be displayed as a bank_information at the new data
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
                  FileMimeTypeEnum.JPG,
                  FileMimeTypeEnum.JPEG,
                  FileMimeTypeEnum.PNG,
                ],
                maxSize,
                uploadedFilePath,
              );

              uploadedFilePath = uploadResult.uploadedFilePath;
              cardImage = uploadResult.fileObj;

              const payload: Prisma.file_managerUncheckedCreateInput = {
                id: uuidv4(),
                user_id: user.id,
                name: uploadResult.fileObj.url.split('/').pop() as string,
                url: uploadResult.fileObj.url,
                mimetype: uploadResult.fileObj.type,
                size: uploadResult.fileObj.size,
                column_name: 'card_image',
                table_name: 'bank_information',
                bank_information_id: updated_banks[i].id,
              };
              fileManagerCreateManyPayload.push(payload);
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
              [
                FileMimeTypeEnum.JPG,
                FileMimeTypeEnum.JPEG,
                FileMimeTypeEnum.PNG,
              ],
              maxSize,
              uploadedFilePath,
            );

            uploadedFilePath = uploadResult.uploadedFilePath;

            const newBankId = uuidv4();

            const newBank: ExistingClientBankInformation = {
              id: newBankId,
              user_id: user.id,
              bank_name: created_banks[i].bank_name,
              bank_account_name: created_banks[i].bank_account_name,
              bank_account_number: created_banks[i].bank_account_number,
              card_image: uploadResult.fileObj,
            };

            newBankInfo.push(newBank);
            createdBankInfo.push(newBank);

            const payload: Prisma.file_managerUncheckedCreateInput = {
              id: uuidv4(),
              user_id: user.id,
              name: uploadResult.fileObj.url.split('/').pop() as string,
              url: uploadResult.fileObj.url,
              mimetype: uploadResult.fileObj.type,
              size: uploadResult.fileObj.size,
              column_name: 'card_image',
              table_name: 'bank_information',
              bank_information_id: newBankId,
            };
            fileManagerCreateManyPayload.push(payload);
          }
        }

        clientOldRequest['bank_information'] = old_banks;
        clientNewRequest['bank_information'] = newBankInfo;
        clientNewRequest = {
          ...clientNewRequest,
          createdBanks: [...createdBankInfo],
          updatedBanks: [...updatedBankInfo],
          deletedBanks: deleted_banks,
        };
      }

      const ofdecFromDb = clientData.board_ofdec_file;
      // console.log({ ofdecFromDb });
      const oldOfdec: finalUploadFileJson[] = [];
      const newOfdec: finalUploadFileJson[] = [];
      if (!!board_ofdec_file && board_ofdec_file.length > 0) {
        // console.log(
        //   'board_ofdec_file[] on request length = ',
        //   board_ofdec_file.length,
        // );
        for (let i = 0; i < board_ofdec_file.length; i++) {
          if (isTenderFilePayload(board_ofdec_file[i])) {
            // console.log(
            //   `board_ofdec_file[${i}] on request is a new file (base64), so we upload it first`,
            // );
            const uploadResult = await this.uploadClientFile(
              user.id,
              'Uploading ofdec File for user',
              board_ofdec_file[i],
              'ofdec',
              [
                FileMimeTypeEnum.JPG,
                FileMimeTypeEnum.JPEG,
                FileMimeTypeEnum.PNG,
                FileMimeTypeEnum.PDF,
              ],
              maxSize,
              uploadedFilePath,
            );

            // console.log('add uploaded file url to uploaded file path');
            uploadedFilePath = uploadResult.uploadedFilePath;
            // console.log({ uploadedFilePath });

            let tmpCreatedOfdec: finalUploadFileJson = uploadResult.fileObj;
            tmpCreatedOfdec.color = 'green';

            // console.log(
            //   `pushing the new file to the new uploaded file of board_ofdec_file[${i}] to newOfdec with green color flags`,
            // );
            newOfdec.push(tmpCreatedOfdec);
            // console.log({ newOfdec });

            const payload: Prisma.file_managerUncheckedCreateInput = {
              id: uuidv4(),
              user_id: user.id,
              url: uploadResult.fileObj.url,
              mimetype: uploadResult.fileObj.type,
              size: uploadResult.fileObj.size,
              column_name: 'board_ofdec_file',
              table_name: 'client_data',
              name: uploadResult.fileObj.url.split('/').pop() as string,
            };
            // console.log(
            //   `create / push the uploaded file (board_ofdec_file[${i}]) to new file manager create payload`,
            // );
            fileManagerCreateManyPayload.push(payload);
            // console.log({ fileManagerCreateManyPayload });
          } else if (isUploadFileJsonb(board_ofdec_file[i])) {
            // console.log(
            //   `board_ofdec_file[${i}] on request is an old file (already uploaded / !== base64)`,
            // );
            // check if ofdecFromDb is array or not with (instance of array)
            let tmpCreatedOfdec: finalUploadFileJson;
            // console.log(
            //   'checking the type of the old ofdec file on db (ofdecFromDb)',
            // );
            if (ofdecFromDb instanceof Array) {
              // console.log(`ofdecFromDb is an instance of array`);
              // console.log(
              //   `checking if the board_ofdec_file[${i}] is exist on ofdecFromDb array`,
              // );
              // if ofdecFromDb is array then search board_ofdec_file[i] inside ofdecFromDb array
              const isExist = ofdecFromDb.findIndex(
                (oldValue: any) => oldValue.url === board_ofdec_file[i].url,
              );
              // if exist then it is unchanged (push to newOfdec and oldOfdec with color of transparent),
              if (isExist > -1) {
                // console.log(
                //   `board_ofdec_file[${i}] (from frequest), is EXIST on ofdecFromDb array`,
                // );
                tmpCreatedOfdec = board_ofdec_file[i];
                tmpCreatedOfdec.color = 'transparent';

                // console.log(
                //   `Pushing board_ofdec_file[${i}] to oldOfdec and newOfdec with transparent color `,
                // );
                newOfdec.push(tmpCreatedOfdec);
                oldOfdec.push(tmpCreatedOfdec);
                // console.log({ oldOfdec });
                // console.log({ newOfdec });
              } else {
                // console.log(
                //   `board_ofdec_file[${i}] (from frequest), is NOT EXIST on ofdecFromDb array`,
                // );
                tmpCreatedOfdec = board_ofdec_file[i];
                tmpCreatedOfdec.color = 'red';
                // console.log(
                //   `Pushing board_ofdec_file[${i}] to oldOfdec with red color `,
                // );
                oldOfdec.push(tmpCreatedOfdec);
                // console.log({ oldOfdec });
              }
            } else {
              // console.log(`ofdecFromDb is an object`);
              const tmpOfdec: UploadFilesJsonbDto = {
                ...(ofdecFromDb as any),
              };
              // console.log({ tmpOfdec });
              // console.log(
              //   `check if the oldOfdec.url same as board_ofdec_file[${i}].url`,
              // );
              // console.log(`ofdecFromDb url ${tmpOfdec.url}`);
              // console.log(
              //   `board_ofdec_file[${i}].url ${board_ofdec_file[i].url}`,
              // );
              if (tmpOfdec.url === board_ofdec_file[i].url) {
                // console.log(
                //   `oldOfdec.url is SAME as the board_ofdec_file[${i}].url`,
                // );
                tmpCreatedOfdec = board_ofdec_file[i];
                tmpCreatedOfdec.color = 'transparent';

                // console.log(
                //   `pushing board_ofdec_file[${i}] to oldOfdec and newOfdec array with transparent color`,
                // );
                oldOfdec.push(tmpCreatedOfdec);
                newOfdec.push(tmpCreatedOfdec);
                // console.log({ oldOfdec });
                // console.log({ newOfdec });
              } else {
                // console.log(
                //   `oldOfdec.url is NOT SAME as the board_ofdec_file[${i}].url`,
                // );
                tmpCreatedOfdec = board_ofdec_file[i];
                tmpCreatedOfdec.color = 'red';
                // console.log(
                //   `pushing board_ofdec_file[${i}] to oldOfdec array with red color`,
                // );
                oldOfdec.push(tmpCreatedOfdec);
                // console.log({ oldOfdec });
              }
            }
          }
        }
      }

      let oldLicenseFile: finalUploadFileJson = clientOldRequest.license_file;
      let newLicenseFile: finalUploadFileJson = clientOldRequest.license_file;
      if (!!license_file) {
        // console.log(logUtil(license_file));
        if (isTenderFilePayload(license_file)) {
          this.logger.log(
            'info',
            'liscene_file is a new file, uploading liscene file',
          );
          const uploadResult = await this.uploadClientFile(
            user.id,
            'Uploading license file for user',
            license_file as TenderFilePayload,
            'liscene-file',
            [FileMimeTypeEnum.JPG, FileMimeTypeEnum.JPEG, FileMimeTypeEnum.PNG],
            maxSize,
            uploadedFilePath,
          );

          uploadedFilePath = uploadResult.uploadedFilePath;

          const payload: Prisma.file_managerUncheckedCreateInput = {
            id: uuidv4(),
            user_id: user.id,
            name: uploadResult.fileObj.url.split('/').pop() as string,
            url: uploadResult.fileObj.url,
            mimetype: uploadResult.fileObj.type,
            size: uploadResult.fileObj.size,
            column_name: 'license_file',
            table_name: 'client_data',
          };
          fileManagerCreateManyPayload.push(payload);

          oldLicenseFile.color = 'red';
          newLicenseFile = uploadResult.fileObj;
          newLicenseFile.color = 'green';
        }
        if (isUploadFileJsonb(license_file)) {
          this.logger.log(
            'info',
            `liscene file is an uploaded file (jsonb), ${logUtil(
              license_file,
            )}`,
          );
          let tmp: UploadFilesJsonbDto = license_file;
          if (tmp.url !== clientOldRequest.license_file.url) {
            oldLicenseFile.color = 'red';
            newLicenseFile = license_file;
            newLicenseFile.color = 'green';
          } else {
            oldLicenseFile.color = 'transparent';
            newLicenseFile.color = 'transparent';
          }
        }
      }

      clientOldRequest.board_ofdec_file = oldOfdec;
      clientNewRequest.board_ofdec_file = newOfdec;
      clientOldRequest.license_file = oldLicenseFile;
      clientNewRequest.license_file = newLicenseFile;

      newEditRequest = {
        ...baseNewEditRequest,
        old_value: JSON.stringify(clientOldRequest),
        new_value: JSON.stringify(clientNewRequest),
      };

      // console.log('final result:');
      // console.log(logUtil(clientOldRequest));
      // console.log(logUtil(clientNewRequest));
      // console.log(logUtil(ofdecFromDb));
      // console.log(logUtil(oldOfdec));
      // console.log(logUtil(newOfdec));
      // console.log(logUtil(fileManagerCreateManyPayload));
      // console.log(logUtil(uploadedFilePath));

      const response = await this.tenderClientRepository.createUpdateRequest(
        newEditRequest,
        fileManagerCreateManyPayload,
      );

      await this.sendEditRequestNotif(response);

      return response;
    } catch (error) {
      this.logger.error(
        `error occured, current uploaded files ${logUtil(uploadedFilePath)}`,
      );
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
      console.log('response', response);

      await this.sendResponseNotif(response);
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

      const response = await this.tenderClientRepository.updateById(
        request.requestId,
        updatePayload,
      );

      await this.sendResponseNotif(response);
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

  async sendResponseNotif(editRequest: RawResponseEditRequestDto['data']) {
    const {
      user,
      reviewer,
      status_id,
      rejected_at,
      reject_reason,
      accepted_at,
    } = editRequest;

    console.log('edit request', editRequest);

    const rejectedTime = !!rejected_at
      ? moment(rejected_at).format('llll')
      : '';
    const approvedTime = !!accepted_at
      ? moment(accepted_at).format('llll')
      : '';

    const clientSubject = `Edit Request ${
      status_id === 'APPROVED' ? 'Approved' : 'Rejected'
    }`;
    const accManagersubject = `Change Edit Request Status Success!`;

    const msgSuffix =
      status_id === 'APPROVED'
        ? `at ${approvedTime}`
        : `, Details: ${reject_reason} at ${rejectedTime}`;

    const clientContent = `Your Edit Requet is ${
      status_id === 'APPROVED' ? 'Approved' : 'Rejected'
    } by The Account Manager ${
      reviewer ? '(' + reviewer.employee_name + ')' : ''
    } ${msgSuffix}`;

    const accManagerContent = `Your reponse is already applied (Changing edit request status from ${user.employee_name} to ${status_id}) ${msgSuffix}`;

    const baseSendEmail: Omit<SendEmailDto, 'to'> = {
      mailType: 'plain',
      from: 'no-reply@hcharity.org',
    };

    /* client ------------------------------------------------------------------------------------------------------------------------ */
    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      to: user.email,
      subject: clientSubject,
      content: clientContent,
    };
    this.emailService.sendMail(clientEmailNotif);

    const clientWebNotifPayload: CreateNotificationDto = {
      user_id: user.id,
      type: 'ACCOUNT',
      subject: clientSubject,
      content: clientContent,
    };
    await this.notificationService.create(clientWebNotifPayload);

    const clientPhone = isExistAndValidPhone(user.mobile_number);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: clientSubject + ', ' + clientContent,
      });
    }
    /* ----------------------------------------------------------------------------------------------------------------------------------- */

    if (reviewer) {
      const accManagerEmailNotif: SendEmailDto = {
        ...baseSendEmail,
        to: reviewer.email,
        subject: accManagersubject,
        content: accManagerContent,
      };
      this.emailService.sendMail(accManagerEmailNotif);

      const accManagerWebNotif: CreateNotificationDto = {
        user_id: reviewer.id,
        type: 'ACCOUNT',
        subject: accManagersubject,
        content: accManagerContent,
      };
      await this.notificationService.create(accManagerWebNotif);

      const accManagerPhone = isExistAndValidPhone(reviewer.mobile_number);
      if (accManagerPhone) {
        this.twilioService.sendSMS({
          body: accManagersubject + ', ' + accManagerContent,
          to: accManagerPhone,
        });
      }
    }
  }

  async sendEditRequestNotif(
    editRequest: RawCreateEditRequestResponse['data'],
  ) {
    const { user } = editRequest;
    let clientSubject = `New Edit Request Submitted Success!`;
    let accManagersubject = `New Edit Request Submitted Success!`;
    let clientContent = `Your edit request is submitted successfully!, please wait until account manager is reponded to your request`;
    let accManagerContent = `There's a new Edit Request from ${user.employee_name}`;

    const baseSendEmail: Omit<SendEmailDto, 'to'> = {
      mailType: 'plain',
      from: 'no-reply@hcharity.org',
    };

    /* the client on this proposal ------------------------------------------------------------------------------------------------ */
    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      to: user.email,
      subject: clientSubject,
      content: clientContent,
    };

    this.emailService.sendMail(clientEmailNotif);

    const clientWebNotifPayload: CreateNotificationDto = {
      user_id: user.id,
      type: 'ACCOUNT',
      subject: clientSubject,
      content: clientContent,
    };
    await this.notificationService.create(clientWebNotifPayload);

    let clientPhone = isExistAndValidPhone(user.mobile_number);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: clientSubject + ', ' + clientContent,
      });
    }
    /* ----------------------------------------------------------------------------------------------------------------------------------- */

    const accountManagers = await this.tenderUserRepository.findByRole(
      'ACCOUNTS_MANAGER',
    );
    if (accountManagers && accountManagers.length > 0) {
      for (let i = 0; i < accountManagers.length; i++) {
        const accManagerEmailNotif: SendEmailDto = {
          ...baseSendEmail,
          to: accountManagers[i].email,
          subject: accManagersubject,
          content: accManagerContent,
        };
        this.emailService.sendMail(accManagerEmailNotif);
        const accManagerWebNotif: CreateNotificationDto = {
          user_id: accountManagers[i].id,
          type: 'ACCOUNT',
          subject: accManagersubject,
          content: accManagerContent,
        };
        await this.notificationService.create(accManagerWebNotif);

        let accManagerPhone = isExistAndValidPhone(
          accountManagers[i].mobile_number,
        );

        if (accManagerPhone) {
          this.twilioService.sendSMS({
            body: accManagersubject + ', ' + accManagerContent,
            to: accManagerPhone,
          });
        }
      }
    }
  }
}
