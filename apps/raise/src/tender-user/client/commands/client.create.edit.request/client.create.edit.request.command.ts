import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import {
  BankInformationCreateProps,
  BankInformationUpdateProps,
} from '../../../../bank/repositories/bank-information.repository';
import { ITenderAppConfig } from '../../../../commons/configs/tender-app-config';
import { FileMimeTypeEnum } from '../../../../commons/enums/file-mimetype.enum';
import { BunnyService } from '../../../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { finalUploadFileJson } from '../../../../tender-commons/dto/final-upload-file-jsonb.dto';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../../tender-commons/dto/upload-files-jsonb.dto';
import { isTenderFilePayload } from '../../../../tender-commons/utils/is-tender-file-payload';
import { isUploadFileJsonb } from '../../../../tender-commons/utils/is-upload-file-jsonb';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from '../../../../tender-file-manager/repositories/tender-file-manager.repository';
import { EditRequestEntity } from '../../../edit-requests/entities/edit.request.entity';
import {
  EditRequestCreateProps,
  EditRequestRepository,
} from '../../../edit-requests/repositories/edit.request.repository';
import { TenderCurrentUser } from '../../../user/interfaces/current-user.interface';
import { TenderUserRepository } from '../../../user/repositories/tender-user.repository';
import {
  ClientEditRequestFieldDto,
  ExistingClientBankInformation,
} from '../../dtos/requests';
import { TenderClientRepository } from '../../repositories/tender-client.repository';
import { TenderClientService } from '../../services/tender-client.service';
import { logUtil } from '../../../../commons/utils/log-util';

export class ClientCreateEditRequestCommand {
  user: TenderCurrentUser;
  editRequest: ClientEditRequestFieldDto;
}

export class ClientCreateEditRequestCommandResult {
  data: {
    created_edit_request: EditRequestEntity;
    created_file_manager: CreateFileManagerProps[];
  };
}

@CommandHandler(ClientCreateEditRequestCommand)
export class ClientCreateEditRequestCommandHandler
  implements
    ICommandHandler<
      ClientCreateEditRequestCommand,
      ClientCreateEditRequestCommandResult
    >
{
  constructor(
    private readonly userRepo: TenderUserRepository,
    private readonly clientRepo: TenderClientRepository,
    private readonly editRequestRepo: EditRequestRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    @InjectPinoLogger(TenderClientService.name) private logger: PinoLogger,
  ) {}

  sanitizeEditRequest(oldData: ClientEditRequestFieldDto) {
    delete oldData.created_banks;
    delete oldData.deleted_banks;
    delete oldData.updated_banks;
    delete oldData.old_banks;
    return oldData;
  }

  async execute(
    command: ClientCreateEditRequestCommand,
  ): Promise<ClientCreateEditRequestCommandResult> {
    let fileManagerPayload: CreateFileManagerProps[] = [];
    const appConfig =
      this.configService.get<ITenderAppConfig>('tenderAppConfig');

    try {
      const {
        created_banks,
        updated_banks,
        deleted_banks,
        old_banks, // current existing bank_information that will be displayed as bank_information at the old data
        board_ofdec_file,
        license_file,
        license_number,
        data_entry_mobile,
        selectLang,
      } = command.editRequest;
      const { user } = command;

      const cd = await this.clientRepo.findClient;

      // check data data_entry_mobile
      if (data_entry_mobile) {
        const isNumExist = await this.userRepo.checkExistance(
          data_entry_mobile,
          '',
          '',
          user.id,
        );
        if (isNumExist.length > 0) {
          if (selectLang === 'en') {
            throw new BadRequestException('Entity Mobile Already Used/Exist!');
          } else {
            throw new BadRequestException(
              'رقم الجوال  المستخدم وموجود بالفعل!',
            );
          }
        }
      }

      // check license number
      if (license_number) {
        const isLicenseExist = await this.userRepo.checkExistance(
          '',
          '',
          license_number,
          user.id,
        );
        if (isLicenseExist.length > 0) {
          if (selectLang === 'en') {
            throw new BadRequestException('License Number Already Used/Exist!');
          } else {
            throw new BadRequestException('رقم الترخيص مستخدم/موجود بالفعل!');
          }
        }
      }

      // check user is active or not if it is not active it will be fail
      const clientData = await this.clientRepo.findClientDataByUserId(user.id);
      if (!clientData) throw new NotFoundException('Client data not found!');

      if (clientData.user.status_id !== 'ACTIVE_ACCOUNT') {
        // if one of them /both of them not exist then throw error
        if (!updated_banks || deleted_banks) {
          throw new BadRequestException(
            'User has to be ACTIVE to perform an edit request!',
          );
        }
      }

      // find old pending log, if there's pending log then it will be fail
      const pendingLogs = await this.clientRepo.countMyPendingLogs(user.id);
      if (pendingLogs > 0) {
        throw new BadRequestException(
          'You are not allowed to ask another request untill accounts manager already responded to your previous request!',
        );
      }

      // create newClientDataObject contain all client data exclude user and id
      const exclude = ['user', 'id'];
      const newClientDataObject = Object.fromEntries(
        Object.entries(clientData).filter(([k]) => !exclude.includes(k)),
      );

      const tmp = {
        ...newClientDataObject,
        bank_information: old_banks,
      } as ClientEditRequestFieldDto;

      // delete created_banks, deleted_banks, updated_banks,old_banks from oldData object (sanitize)
      const clientOldRequest = this.sanitizeEditRequest(tmp); // previous data
      let clientNewRequest = this.sanitizeEditRequest(command.editRequest); // data requested to account manager to be approved
      const createdBankInfo: ExistingClientBankInformation[] = [];
      const updatedBankInfo: ExistingClientBankInformation[] = [];
      const deletedBankInfo: ExistingClientBankInformation[] = [];

      const editRequestCreatePayload = Builder<EditRequestCreateProps>(
        EditRequestCreateProps,
        {
          id: uuidv4(),
          user_id: user.id,
          status_id: 'PENDING',
        },
      ).build();

      // the bank_information that will be displayed as a bank_information at the new data
      const newBankInfo: ExistingClientBankInformation[] = [];

      // if (old_banks && old_banks.length > 0) {
      if (old_banks) {
        newBankInfo.push(...old_banks);
      }

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
            const uploadRes = await this.bunnyService.uploadFileBase64(
              updated_banks[i].card_image,
              `tmra/${appConfig?.env}/organization/tender-management/client-data/${user.id}/bank-info`,
              [
                FileMimeTypeEnum.JPG,
                FileMimeTypeEnum.JPEG,
                FileMimeTypeEnum.PNG,
              ],
              1024 * 1024 * 6,
            );

            fileManagerPayload.push({
              id: uuidv4(),
              user_id: user.id,
              name: uploadRes.name,
              mimetype: uploadRes.type,
              size: uploadRes.size,
              url: uploadRes.url,
              column_name: 'card_image',
              table_name: 'bank_information',
              bank_information_id: updated_banks[i].id,
            });

            const tmpPayload = {
              url: uploadRes.url,
              size: uploadRes.size,
              type: uploadRes.type,
            };
            cardImage = tmpPayload;
          }

          // if bank_id changed (for bank name)
          if (
            !!updated_banks[i].bank_id &&
            updated_banks[i].bank_id !== undefined &&
            typeof updated_banks[i].bank_id === 'string' &&
            updated_banks[i].bank_id !== '' &&
            updated_banks[i].bank_id !== oldData.bank_id
          ) {
            const validBank = await this.clientRepo.validateBankId(
              updated_banks[i].bank_id!,
            );
            if (!validBank) {
              throw new BadRequestException(
                `invalid bank id on updated_banks index ${i}`,
              );
            }
          }

          const newBankData = Builder<BankInformationUpdateProps>(
            BankInformationUpdateProps,
            {
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
              card_image: cardImage,
              bank_id:
                updated_banks[i].bank_id !== oldData.bank_id
                  ? updated_banks[i].bank_id
                  : oldData.bank_id,
              // DEPRECATED
              // bank_name:
              //   updated_banks[i].bank_name !== oldData.bank_name
              //     ? updated_banks[i].bank_name
              //     : oldData.bank_name,
            },
          ).build();

          newBankInfo[idx] = newBankData as ExistingClientBankInformation;
          updatedBankInfo.push(newBankData as ExistingClientBankInformation);
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
          const uploadRes = await this.bunnyService.uploadFileBase64(
            created_banks[i].card_image,
            `tmra/${appConfig?.env}/organization/tender-management/client-data/${user.id}/bank-info`,
            [FileMimeTypeEnum.JPG, FileMimeTypeEnum.JPEG, FileMimeTypeEnum.PNG],
            1024 * 1024 * 6,
          );

          const newBankId = uuidv4();

          fileManagerPayload.push({
            id: uuidv4(),
            user_id: user.id,
            name: uploadRes.name,
            mimetype: uploadRes.type,
            size: uploadRes.size,
            url: uploadRes.url,
            column_name: 'card_image',
            table_name: 'bank_information',
            bank_information_id: newBankId,
          });

          const tmpPayload = {
            url: uploadRes.url,
            size: uploadRes.size,
            type: uploadRes.type,
          };

          const newBankData = Builder<BankInformationCreateProps>(
            BankInformationCreateProps,
            {
              id: newBankId,
              user_id: user.id,
              bank_id: created_banks[i].bank_id,
              // DEPRECARED
              // bank_name: created_banks[i].bank_name,
              bank_account_name: created_banks[i].bank_account_name,
              bank_account_number: created_banks[i].bank_account_number,
              card_image: tmpPayload,
            },
          ).build();

          newBankInfo.push(newBankData as ExistingClientBankInformation);
          createdBankInfo.push(newBankData as ExistingClientBankInformation);
        }
      }
      // }
      clientOldRequest['bank_information'] = old_banks;
      clientNewRequest['bank_information'] = newBankInfo;
      clientNewRequest = {
        ...clientNewRequest,
        createdBanks: [...createdBankInfo],
        updatedBanks: [...updatedBankInfo],
        deletedBanks: deleted_banks,
      };

      const ofdecFromDb = clientData?.board_ofdec_file; // old client data ofdec (old ofdec)
      // console.log('ofdec from db', ofdecFromDb);

      const oldOfdec: finalUploadFileJson[] = [];
      const newOfdec: finalUploadFileJson[] = [];

      // board_ofdec_file here is from the request (new ofdec)
      if (!!board_ofdec_file && board_ofdec_file.length > 0) {
        // this.logger.info(`new ofdec from request %j`, board_ofdec_file);
        // validating if ofdec from request is already uploaded
        for (let i = 0; i < board_ofdec_file.length; i++) {
          if (isTenderFilePayload(board_ofdec_file[i])) {
            // console.log('ofdec is base64, upload it first');
            const uploadRes = await this.bunnyService.uploadFileBase64(
              board_ofdec_file[i],
              `tmra/${appConfig?.env}/organization/tender-management/client-data/${user.id}/ofdec`,
              [
                FileMimeTypeEnum.JPG,
                FileMimeTypeEnum.JPEG,
                FileMimeTypeEnum.PNG,
                FileMimeTypeEnum.PDF,
              ],
              1024 * 1024 * 6,
            );

            const tmpPayload = {
              url: uploadRes.url,
              size: uploadRes.size,
              type: uploadRes.type,
            };

            // console.log('upload kelar', tmpPayload);
            const tmpCreatedOfdec: finalUploadFileJson = tmpPayload;
            tmpCreatedOfdec.color = 'green';

            // `pushing the new file to the new uploaded file of board_ofdec_file[${i}] to newOfdec with green color flags`,
            newOfdec.push(tmpCreatedOfdec);

            fileManagerPayload.push({
              id: uuidv4(),
              user_id: user.id,
              name: uploadRes.name,
              mimetype: uploadRes.type,
              size: uploadRes.size,
              url: uploadRes.url,
              column_name: 'board_ofdec_file',
              table_name: 'client_data',
            });
            // console.log('pushed file manager', fileManagerPayload);
          } else if (isUploadFileJsonb(board_ofdec_file[i])) {
            // console.log('ofdec is already uploaded file');
            // check if ofdecFromDb is array or not with (instance of array)
            let tmpCreatedOfdec: finalUploadFileJson;
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

        //handling either old ofdec exist or not
        if (!!ofdecFromDb) {
          // handling if old ofdec is exist, either is array or not
          // console.log('ofdec from db exist');
          if (ofdecFromDb instanceof Array) {
            // console.log('ofdec from db is array');
            ofdecFromDb.forEach((existingOfdec) => {
              if (isUploadFileJsonb(existingOfdec)) {
                // console.log({ existingOfdec });
                const tmpExisting: finalUploadFileJson = existingOfdec as any;
                const idx = newOfdec.findIndex(
                  (newData) => newData.url === tmpExisting.url,
                );

                if (idx === -1) {
                  tmpExisting.color = 'red';
                  oldOfdec.push(tmpExisting);
                  // console.log({ oldOfdec });
                }
              }
            });
          } else {
            // console.log('offdec from db is not an array');
            if (isUploadFileJsonb(ofdecFromDb)) {
              // console.log('offdec from db is a jsonb (upload file jsonb)');
              const tmpExisting: finalUploadFileJson = ofdecFromDb as any;
              const idx = newOfdec.findIndex(
                (newData) => newData.url === tmpExisting.url,
              );

              if (idx === -1) {
                tmpExisting.color = 'red';
                oldOfdec.push(tmpExisting);
              }
            }
          }
        }
      }

      // console.log('oldOfdec', oldOfdec);
      // console.log('newOfdec', newOfdec);

      let oldLicenseFile: finalUploadFileJson | null =
        clientOldRequest?.license_file || null;
      let newLicenseFile: finalUploadFileJson | null =
        clientOldRequest?.license_file || null;

      // console.log(`oldLicenseFile`, oldLicenseFile);
      // console.log(`license_file from request ${logUtil(license_file)}`);

      // if there's new license file form request
      if (!!license_file) {
        // console.log(
        //   `is TenderFilePayload ${isTenderFilePayload(license_file)}`,
        // );
        // console.log(`is isUploadFileJsonb ${isUploadFileJsonb(license_file)}`);
        // if it is unuploaded file
        if (isTenderFilePayload(license_file)) {
          // console.log('license is tender file payload');
          // console.log('license file is a new file', license_file);
          const uploadRes = await this.bunnyService.uploadFileBase64(
            license_file as TenderFilePayload,
            `tmra/${appConfig?.env}/organization/tender-management/client-data/${user.id}/liscene-file`,
            [
              FileMimeTypeEnum.JPG,
              FileMimeTypeEnum.JPEG,
              FileMimeTypeEnum.PNG,
              FileMimeTypeEnum.PDF,
            ],
            1024 * 1024 * 6,
          );

          const tmpPayload = {
            url: uploadRes.url,
            size: uploadRes.size,
            type: uploadRes.type,
          };

          const tmpCreatedOfdec: finalUploadFileJson = tmpPayload;
          tmpCreatedOfdec.color = 'green';

          // `pushing the new file to the new uploaded file of board_ofdec_file[${i}] to newOfdec with green color flags`,
          newOfdec.push(tmpCreatedOfdec);

          fileManagerPayload.push({
            id: uuidv4(),
            user_id: user.id,
            name: uploadRes.name,
            mimetype: uploadRes.type,
            size: uploadRes.size,
            url: uploadRes.url,
            column_name: 'license_file',
            table_name: 'client_data',
          });

          if (oldLicenseFile) {
            oldLicenseFile.color = 'red';
          }
          newLicenseFile = tmpPayload;
          newLicenseFile.color = 'green';
        }
        // if it is already uploaded file
        if (isUploadFileJsonb(license_file)) {
          // console.log('license file is jsonb');
          if (
            oldLicenseFile &&
            oldLicenseFile !== null &&
            newLicenseFile &&
            newLicenseFile !== null
          ) {
            const tmp: UploadFilesJsonbDto = license_file;
            if (tmp.url !== clientOldRequest.license_file.url) {
              oldLicenseFile.color = 'red';
              newLicenseFile = {
                ...license_file,
                color: 'green',
              };
            } else {
              oldLicenseFile.color = 'transparent';
              newLicenseFile.color = 'transparent';
            }
          } else {
            oldLicenseFile = null;
            newLicenseFile = {
              ...license_file,
              color: 'green',
            };
          }
        }
      }

      clientOldRequest.board_ofdec_file = oldOfdec;
      clientNewRequest.board_ofdec_file = newOfdec;
      clientOldRequest.license_file = oldLicenseFile;
      clientNewRequest.license_file = newLicenseFile;

      editRequestCreatePayload.old_value = JSON.stringify(clientOldRequest);
      editRequestCreatePayload.new_value = JSON.stringify(clientNewRequest);

      // console.log('final result:');
      // console.log(logUtil(clientOldRequest));
      // console.log(logUtil(clientNewRequest));
      // console.log(logUtil(ofdecFromDb));
      // console.log(logUtil(oldOfdec));
      // console.log(logUtil(newOfdec));
      // console.log(logUtil(fileManagerCreateManyPayload));
      // console.log(logUtil(uploadedFilePath));

      const dbRes = await this.prismaService.$transaction(
        async (session) => {
          const tx =
            session instanceof PrismaService ? session : this.prismaService;

          const createdEditRequest = await this.editRequestRepo.create(
            editRequestCreatePayload,
            tx,
          );

          if (fileManagerPayload && fileManagerPayload.length > 0) {
            for (const file of fileManagerPayload) {
              await this.fileManagerRepo.create(file, tx);
            }
          }

          await this.editRequestRepo.deleteMany(
            {
              user_id: user.id,
              status_id: ['APPROVED', 'REJECTED'],
            },
            tx,
          );

          return {
            created_edit_request: createdEditRequest,
            created_file_manager: fileManagerPayload,
          };
        },
        { timeout: 5000 },
      );

      // await this.sendEditRequestNotif(response);

      return {
        data: dbRes,
      };
    } catch (error) {
      this.logger.error(
        `error occured, current uploaded files %j`,
        fileManagerPayload,
      );
      if (fileManagerPayload.length > 0) {
        this.logger.info(
          `Error occured during edit request, deleting all previous uploaded files: %j`,
          error,
        );
        if (fileManagerPayload.length > 0) {
          for (const file of fileManagerPayload) {
            await this.bunnyService.deleteMedia(file.url, true);
          }
        }
      }
      throw error;
    }
  }
}
