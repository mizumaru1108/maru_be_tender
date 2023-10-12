import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma, bank_information } from '@prisma/client';
import { Builder } from 'builder-pattern';
import {
  BankInformationCreateProps,
  BankInformationRepository,
  BankInformationUpdateProps,
} from '../../../../bank/repositories/bank-information.repository';
import { logUtil } from '../../../../commons/utils/log-util';
import { PrismaService } from '../../../../prisma/prisma.service';
import { finalUploadFileJson } from '../../../../tender-commons/dto/final-upload-file-jsonb.dto';
import { UploadFilesJsonbDto } from '../../../../tender-commons/dto/upload-files-jsonb.dto';
import { prismaErrorThrower } from '../../../../tender-commons/utils/prisma-error-thrower';
import { EditRequestRepository } from '../../../edit-requests/repositories/edit.request.repository';
import {
  TenderUserRepository,
  UpdateUserProps,
} from '../../../user/repositories/tender-user.repository';
import { ClientDataEntity } from '../../entities/client-data.entity';
import {
  TenderClientRepository,
  UpdateClientDataProps,
} from '../../repositories/tender-client.repository';
import { TenderClientService } from '../../services/tender-client.service';
import { isUploadFileJsonb } from '../../../../tender-commons/utils/is-upload-file-jsonb';
import { FusionAuthService } from '../../../../libs/fusionauth/services/fusion-auth.service';
import { EditRequestEntity } from '../../../edit-requests/entities/edit.request.entity';

export class ClientApproveEditRequestCommand {
  reviewerId: string;
  requestId: string;
}

export class ClientApproveEditRequestCommandResult {
  data: EditRequestEntity;
}

@CommandHandler(ClientApproveEditRequestCommand)
export class ClientApproveEditRequestCommandHandler
  implements
    ICommandHandler<
      ClientApproveEditRequestCommand,
      ClientApproveEditRequestCommandResult
    >
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly editRequestRepo: EditRequestRepository,
    private readonly userRepo: TenderUserRepository,
    private readonly bankInfoRepo: BankInformationRepository,
    private readonly clientDataRepo: TenderClientRepository,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

  async execute(
    command: ClientApproveEditRequestCommand,
  ): Promise<ClientApproveEditRequestCommandResult> {
    const { requestId, reviewerId } = command;
    const requestData = await this.editRequestRepo.findFirst({ id: requestId });

    if (!requestData) {
      throw new BadRequestException('No Request Data Found!');
    }

    let old_data: ClientDataEntity;
    let new_data: ClientDataEntity;
    // let created_bank: Prisma.bank_informationCreateManyInput[] = [];
    let created_bank: BankInformationCreateProps[] = [];
    let updated_bank: BankInformationUpdateProps[] = [];
    let deleted_bank: bank_information[] = [];
    const deletedFileManagerUrls: string[] = [];

    try {
      const { old_value, new_value, user_id } = requestData;

      const oldTmp = JSON.parse(old_value);
      delete oldTmp.bank_information;
      old_data = oldTmp;

      const newTmp = JSON.parse(new_value);
      created_bank = newTmp['createdBanks'];
      updated_bank = newTmp['updatedBanks'];
      deleted_bank = newTmp['deletedBanks'];

      delete newTmp.bank_information;
      delete newTmp.createdBanks;
      delete newTmp.updatedBanks;
      delete newTmp.deletedBanks;
      new_data = newTmp;

      const client = await this.clientDataRepo.findFirst({
        user_id: user_id,
      });
      if (!client) {
        throw new NotFoundException(`client with id of ${user_id} not found!`);
      }

      const clientDataUpdateProps = Builder<UpdateClientDataProps>(
        UpdateClientDataProps,
        {
          ...new_data,
          id: client.id,
          user_id,
        },
      ).build();

      const userDataUpdateProps = Builder<UpdateUserProps>(UpdateUserProps, {
        id: user_id,
      }).build();

      const oldLicenseFile: finalUploadFileJson = old_data.license_file as any;

      if (oldLicenseFile.color === 'red' && !!oldLicenseFile.url) {
        deletedFileManagerUrls.push(oldLicenseFile.url);
      }

      if (new_data.license_file) {
        const tmpLicense: finalUploadFileJson = new_data.license_file as any;
        if (
          tmpLicense.hasOwnProperty('color') &&
          tmpLicense.color === 'green'
        ) {
          clientDataUpdateProps.license_file = {
            url: tmpLicense.url,
            size: tmpLicense.size,
            type: tmpLicense.type,
          };
        }
      }

      if (
        new_data.data_entry_mobile &&
        new_data.data_entry_mobile !== old_data.data_entry_mobile
      ) {
        userDataUpdateProps.mobile_number = new_data.data_entry_mobile;
        clientDataUpdateProps.data_entry_mobile = new_data.data_entry_mobile;
      }

      if (old_data.board_ofdec_file) {
        const tmpOldOfdec: finalUploadFileJson[] =
          old_data.board_ofdec_file as any;

        for (let i = 0; i < tmpOldOfdec.length; i++) {
          if (tmpOldOfdec[i].hasOwnProperty('color')) {
            if (tmpOldOfdec[i].color === 'red' && !!tmpOldOfdec[i].url) {
              const index = deletedFileManagerUrls.findIndex(
                (arrUrl) => arrUrl === tmpOldOfdec[i].url,
              );
              if (index === -1) deletedFileManagerUrls.push(tmpOldOfdec[i].url);
            }
          }
        }
      }

      if (new_data.board_ofdec_file) {
        const tmpArr: UploadFilesJsonbDto[] = [];
        const tmpNewOfdec: finalUploadFileJson[] =
          new_data.board_ofdec_file as any;

        for (let i = 0; i < tmpNewOfdec.length; i++) {
          if (tmpNewOfdec[i].hasOwnProperty('color')) {
            if (tmpNewOfdec[i].color === 'red' && !!tmpNewOfdec[i].url) {
              const index = deletedFileManagerUrls.findIndex(
                (arrUrl) => arrUrl === tmpNewOfdec[i].url,
              );
              if (index === -1) deletedFileManagerUrls.push(tmpNewOfdec[i].url);
            }
            delete tmpNewOfdec[i].color;
            tmpArr.push(tmpNewOfdec[i]);
          }
        }

        clientDataUpdateProps.board_ofdec_file = tmpArr as any;
      }

      userDataUpdateProps.status_id = 'ACTIVE_ACCOUNT';

      // console.log('user data', logUtil(userDataUpdateProps));
      // console.log('client data', logUtil(clientDataUpdateProps));
      // console.log('created bank', logUtil(created_bank));
      // console.log('updated bank', logUtil(updated_bank));
      // console.log('deleted bank', logUtil(deleted_bank));

      const dbRes = await this.prismaService.$transaction(
        async (session) => {
          const tx =
            session instanceof PrismaService ? session : this.prismaService;

          // console.log('updating client');
          if (clientDataUpdateProps) {
            await this.clientDataRepo.update(clientDataUpdateProps, tx);
          }

          // not just user id
          // console.log('updating USER');
          if (Object.keys(userDataUpdateProps).length > 1) {
            await this.userRepo.update(userDataUpdateProps, tx);

            // also update the fusion auth
            await this.fusionAuthService.fusionAuthUpdateUser(user_id, {
              firstName:
                userDataUpdateProps.employee_name &&
                !!userDataUpdateProps.employee_name
                  ? (userDataUpdateProps.employee_name as string)
                  : undefined,
              mobilePhone:
                userDataUpdateProps.mobile_number &&
                !!userDataUpdateProps.mobile_number
                  ? (userDataUpdateProps.mobile_number as string)
                  : undefined,
            });
          }

          // console.log('create bank');
          if (created_bank && created_bank.length > 0) {
            for (const cBank of created_bank) {
              await this.bankInfoRepo.create(cBank, tx);
            }
          }

          // console.log('update bank');
          if (updated_bank && updated_bank.length > 0) {
            for (let i = 0; i < updated_bank.length; i++) {
              const oldBank = await tx.bank_information.findUnique({
                where: {
                  id: updated_bank[i].id,
                },
              });

              if (
                oldBank &&
                oldBank.card_image &&
                isUploadFileJsonb(oldBank.card_image) &&
                updated_bank[i].card_image &&
                isUploadFileJsonb(updated_bank[i].card_image)
              ) {
                const tmpOldbank: UploadFilesJsonbDto =
                  oldBank.card_image as any;
                const tmpNewBank: UploadFilesJsonbDto = updated_bank[i]
                  .card_image as any;

                if (tmpOldbank.url !== tmpNewBank.url) {
                  const oldData = await tx.file_manager.findUnique({
                    where: {
                      url: tmpOldbank.url,
                    },
                  });

                  if (oldData !== null) {
                    await tx.file_manager.update({
                      where: {
                        id: oldData.id,
                      },
                      data: {
                        is_deleted: true,
                      },
                    });
                  }
                }
              }

              await tx.bank_information.update({
                where: {
                  id: updated_bank[i].id,
                },
                data: {
                  user_id: updated_bank[i].user_id,
                  bank_name: updated_bank[i].bank_name,
                  bank_id: updated_bank[i].bank_id,
                  bank_account_name: updated_bank[i].bank_account_name,
                  bank_account_number: updated_bank[i].bank_account_number,
                  card_image: updated_bank[i].card_image,
                } as Prisma.bank_informationUncheckedUpdateInput,
              });
            }
          }

          // console.log('delete bank');
          if (deleted_bank && deleted_bank.length > 0) {
            for (let i = 0; i < deleted_bank.length; i++) {
              const oldBank = await tx.bank_information.findUnique({
                where: {
                  id: deleted_bank[i].id,
                },
              });

              if (!!oldBank) {
                await tx.bank_information.update({
                  where: {
                    id: deleted_bank[i].id,
                  },
                  data: {
                    is_deleted: true,
                  },
                });
              }

              const { url } = deleted_bank[i].card_image as any;
              const oldFileManager = await tx.file_manager.findUnique({
                where: {
                  url,
                },
              });

              if (oldFileManager !== null) {
                await tx.file_manager.update({
                  where: {
                    url,
                  },
                  data: {
                    is_deleted: true,
                  },
                });
              }
            }
          }

          // console.log('delete file manager');
          if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
            for (let i = 0; i < deletedFileManagerUrls.length; i++) {
              const fileManager = await tx.file_manager.findFirst({
                where: { url: deletedFileManagerUrls[i] },
              });
              if (fileManager) {
                await tx.file_manager.update({
                  where: { url: deletedFileManagerUrls[i] },
                  data: { is_deleted: true },
                });
              }
            }
          }

          // console.log('updateing edit request');
          const editRequestResult = await this.editRequestRepo.update(
            {
              id: requestId,
              reviewer_id: reviewerId,
              status_id: 'APPROVED',
              accepted_at: new Date(),
            },
            tx,
          );

          return editRequestResult;
        },
        {
          timeout: 120000,
        },
      );

      // await this.sendResponseNotif(response);
      return {
        data: dbRes,
      };
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
