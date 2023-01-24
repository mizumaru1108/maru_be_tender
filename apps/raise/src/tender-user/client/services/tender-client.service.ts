import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ICurrentUser } from '../../../user/interfaces/current-user.interface';

import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
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
import { CreateEditRequestLogMapper } from '../mappers/create-edit-request-log.mapper';
import { UserClientDataMapper } from '../mappers/user-client-data.mapper';
import { TenderClientRepository } from '../repositories/tender-client.repository';
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

  async findEditRequests(request: SearchEditRequestFilter) {
    const response = await this.tenderClientRepository.findEditRequests(
      request,
    );
    return response;
  }

  async findEditRequestByLogId(request_id: string) {
    const log = await this.tenderClientRepository.findEditRequestLogByRequestId(
      request_id,
    );
    if (!log) throw new NotFoundException('Edit Request Not Found!');

    return {
      // current_data: {
      //   client_data: log.user.client_data,
      //   bank_informations: log.user.bank_information,
      // }
      // log,
      current_data: {
        ...JSON.parse(log.old_value!),
      },
      new_request: {
        ...JSON.parse(log.new_value),
      },
    };

    // return log;
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
      const fullPayloadFinal = this.sanitizeEditRequest(editRequest);

      let newEditRequest: Prisma.edit_request_logsUncheckedCreateInput[] = [];

      const editRequestLogPayload = CreateEditRequestLogMapper(user.id);

      const baseEditRequest = {
        request_id: editRequestLogPayload.id,
      };

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
            if (
              updated_banks[i].card_image.hasOwnProperty('base64Data') &&
              typeof updated_banks[i].card_image.base64Data === 'string' &&
              !!updated_banks[i].card_image.base64Data &&
              updated_banks[i].card_image.hasOwnProperty('fullName') &&
              typeof updated_banks[i].card_image.fullName === 'string' &&
              !!updated_banks[i].card_image.fullName &&
              updated_banks[i].card_image.hasOwnProperty('fileExtension') &&
              typeof updated_banks[i].card_image.fileExtension === 'string' &&
              !!updated_banks[i].card_image.fileExtension &&
              updated_banks[i].card_image.fileExtension.match(
                /^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i,
              ) &&
              updated_banks[i].card_image.hasOwnProperty('size') &&
              typeof updated_banks[i].card_image.size === 'number'
            ) {
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

            newEditRequest.push({
              id: uuidv4(),
              identifier: `bankInfo@updated(${i + 1})`,
              old_value: JSON.stringify(oldData),
              new_value: JSON.stringify(newData),
              ...baseEditRequest,
            });

            newBankInfo[idx] = newData as any;
          }
        }

        if (deleted_banks && deleted_banks.length > 0) {
          for (let i = 0; i < deleted_banks.length; i++) {
            const idx = newBankInfo.findIndex(
              (value) => value.id === deleted_banks[i].id,
            );
            const oldData = newBankInfo[idx];
            newEditRequest.push({
              id: uuidv4(),
              identifier: `bankInfo@deleted(${i + 1})`,
              old_value: JSON.stringify(oldData ?? undefined),
              new_value: JSON.stringify(deleted_banks[i]),
              ...baseEditRequest,
            });

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

            const bankInfo: Prisma.bank_informationUncheckedCreateInput = {
              id: uuidv4(),
              user_id: user.id,
              bank_name: created_banks[i].bank_name,
              bank_account_name: created_banks[i].bank_account_name,
              bank_account_number: created_banks[i].bank_account_number,
              card_image: uploadResult.fileObj,
            };

            newEditRequest.push({
              id: uuidv4(),
              identifier: `bankInfo@created(${i + 1})`,
              old_value: undefined,
              new_value: JSON.stringify(bankInfo),
              ...baseEditRequest,
            });

            newBankInfo.push({
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

        newEditRequest.push({
          id: uuidv4(),
          identifier: `full_payload`,
          old_value: JSON.stringify(fullPayloadRequest),
          new_value: JSON.stringify(fullPayloadFinal),
          ...baseEditRequest,
        });
      }

      // console.log('the edit request', newEditRequest);

      const response = await this.tenderClientRepository.createUpdateRequest(
        editRequestLogPayload,
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

  async findMyPendingLogCount(user_id: string) {
    return await this.tenderClientRepository.countMyPendingLogs(user_id);
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

  // single accept for edit request
  // async acceptEditRequest(reviewerId: string, request: ApproveEditRequestDto) {
  //   // check if the request is exist and not approved yet
  //   const editRequest = await this.tenderClientRepository.findUpdateRequestById(
  //     request.requestId,
  //   );
  //   if (!editRequest) throw new NotFoundException('Edit request not found!');

  //   // check if the request is already approved / rejected
  //   if (editRequest.approval_status === 'APPROVED') {
  //     throw new BadRequestException('Edit request already approved!');
  //   }
  //   if (editRequest.approval_status === 'REJECTED') {
  //     throw new BadRequestException('Edit request already rejected!');
  //   }

  //   let logs: string = '';
  //   let itemsLeft: string[] = [];

  //   // check the field type
  //   const {
  //     field_type: fieldType,
  //     new_value: newValue,
  //     field_name: fieldName,
  //   } = editRequest;

  //   // parse the new value to the correct type based on the field type
  //   const parsedValue = this.valueParser(fieldType, newValue);

  //   // approve the request, and change the field value
  //   if (
  //     [
  //       'password',
  //       'email',
  //       'entity_mobile',
  //       'employee_name',
  //       'bank_information',
  //     ].indexOf(fieldName) === -1
  //   ) {
  //     await this.tenderClientRepository.appoveUpdateRequest(
  //       editRequest,
  //       reviewerId,
  //       parsedValue,
  //     );
  //   } else {
  //     console.log('on else');
  //     // TODO: if it password, email, phone number / bank apply custom logic.
  //   }

  //   // count the remaining request
  //   const remainingRequest =
  //     await this.tenderClientRepository.getRemainingUpdateRequestCount(
  //       editRequest.user_id,
  //     );

  //   if (remainingRequest.length === 0) {
  //     await this.tenderUserRepository.changeUserStatus(
  //       editRequest.user_id,
  //       'ACTIVE_ACCOUNT',
  //     );
  //     logs = 'All edit request has been approved, your account is active now!';
  //   }

  //   if (remainingRequest.length > 0) {
  //     itemsLeft = remainingRequest.map((item: edit_request) => {
  //       return ` [${item.field_name}]`;
  //     });

  //     logs = `Edit request has been approved, you have ${remainingRequest.length} request(s) remaining,  your account is still inactive!`;
  //   }

  //   return {
  //     logs,
  //     itemsLeft,
  //   };
  // }

  // batch accept for edit request
  // async acceptEditRequests(
  //   reviewerId: string,
  //   request: BatchApproveEditRequestDto,
  // ) {
  //   // check if the request is exist and not approved yet
  //   const editRequests =
  //     await this.tenderClientRepository.findUnapprovedEditRequestByUserId(
  //       request.userId,
  //     );

  //   const updateClientPayload: Record<string, any> = {};
  //   const updateUserPayload: Record<string, any> = {};
  //   let createBankInfoPayload: Prisma.bank_informationCreateInput[] = [];
  //   const updateBankInfoPayload: UpdateBankInfoPayload[] = [];
  //   const fusionAuthChangeUserPayload: UpdateUserPayload = {};

  //   if (editRequests.length > 0) {
  //     editRequests.forEach((editRequest) => {
  //       const parsedValue = this.valueParser(
  //         editRequest.field_type,
  //         editRequest.new_value,
  //       );

  //       // change email and mobile will be implemented later on
  //       // if (
  //       //   ['employee_name', 'email', 'entity_mobile'].indexOf(
  //       //     editRequest.field_name,
  //       //   ) > -1
  //       // ) {
  //       if (['employee_name'].indexOf(editRequest.field_name) > -1) {
  //         updateUserPayload[editRequest.field_name] = parsedValue;
  //         // will be user later on after email and mobile number can be edited.
  //         // if (editRequest.field_name === 'email') {
  //         //   fusionAuthChangeUserPayload.email = parsedValue;
  //         // }
  //         // if (editRequest.field_name === 'entity_mobile') {
  //         //   fusionAuthChangeUserPayload.mobile_number = parsedValue;
  //         // }
  //         if (editRequest.field_name === 'employee_name') {
  //           fusionAuthChangeUserPayload.employee_name = parsedValue;
  //         }
  //       } else if (editRequest.field_name.split('.')[0] === 'bankInfo') {
  //         const bankInfoId = editRequest.field_name.split('.')[1];
  //         const bankInfoField = editRequest.field_name.split('.')[2];

  //         if (updateBankInfoPayload.length > 0) {
  //           updateBankInfoPayload.forEach((item) => {
  //             // if item._id === bankinfoId then add the field to the data, else create new item
  //             if (item._id === bankInfoId) {
  //               item.data[bankInfoField] = parsedValue;
  //             } else {
  //               updateBankInfoPayload.push({
  //                 _id: bankInfoId,
  //                 data: {
  //                   [bankInfoField]: parsedValue,
  //                 },
  //               });
  //             }
  //           });
  //         } else {
  //           updateBankInfoPayload.push({
  //             _id: bankInfoId,
  //             data: {
  //               [bankInfoField]: parsedValue,
  //             },
  //           });
  //         }
  //       } else if (editRequest.field_name === 'newBankInfo') {
  //         // push to current array
  //         createBankInfoPayload = [
  //           ...(createBankInfoPayload || []),
  //           parsedValue as Prisma.bank_informationCreateInput,
  //         ];
  //       } else if (editRequest.field_name === 'password') {
  //         fusionAuthChangeUserPayload.password = parsedValue;
  //       } else {
  //         updateClientPayload[editRequest.field_name] = parsedValue;
  //       }
  //     });
  //   }

  //   this.logger.log('info', 'client update payload', updateClientPayload);
  //   this.logger.log('info', 'user update payload', updateUserPayload);
  //   this.logger.log('info', 'bank info update payload', updateBankInfoPayload);
  //   this.logger.log(
  //     'info',
  //     'create many bank info payload',
  //     createBankInfoPayload,
  //   );
  //   this.logger.log(
  //     'info',
  //     'user new password',
  //     fusionAuthChangeUserPayload.password,
  //   );

  //   // const response =
  //   await this.tenderClientRepository.approveEditRequests(
  //     request.userId,
  //     reviewerId,
  //     updateClientPayload,
  //     updateUserPayload,
  //     createBankInfoPayload,
  //     updateBankInfoPayload,
  //   );
  //   // console.log('response', response);

  //   if (Object.keys(fusionAuthChangeUserPayload).length > 0) {
  //     this.logger.log(
  //       'info',
  //       'changing user info on fusion auth with: ',
  //       fusionAuthChangeUserPayload,
  //     );

  //     const fusionAuthResponse =
  //       await this.fusionAuthService.fusionAuthUpdateUser(
  //         request.userId,
  //         fusionAuthChangeUserPayload,
  //       );

  //     this.logger.log(
  //       'info',
  //       'FusionAuth Changing is',
  //       fusionAuthResponse ? 'success' : 'failed',
  //     );
  //   }
  // }
}
