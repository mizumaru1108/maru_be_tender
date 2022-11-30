import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { client_data, edit_request, Prisma, user_status } from '@prisma/client';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderClientRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderClientRepository.name,
  });

  constructor(private readonly prismaService: PrismaService) {}

  async validateStatus(status: string): Promise<user_status | null> {
    try {
      return await this.prismaService.user_status.findUnique({
        where: { id: status },
      });
    } catch (error) {
      this.logger.error('validateStatus error:', error);
      const theEror = prismaErrorThrower(error, `find client and user!`);
      throw theEror;
    }
  }

  async findClient(
    passedQuery?: Prisma.client_dataWhereInput,
    selectQuery?: Prisma.client_dataSelect | null | undefined,
    includeQuery?: Prisma.client_dataInclude | null | undefined,
  ): Promise<client_data | null> {
    const findFirstArg: Prisma.client_dataFindFirstArgs = {};
    if (passedQuery) findFirstArg.where = passedQuery;
    if (selectQuery) findFirstArg.select = selectQuery;
    if (includeQuery) findFirstArg.include = includeQuery;
    try {
      return await this.prismaService.client_data.findFirst(findFirstArg);
    } catch (error) {
      this.logger.error('findClient error:', error);
      const theEror = prismaErrorThrower(error, `find client and user!`);
      throw theEror;
    }
  }

  async findClientAndUser(userId: string) {
    try {
      return await this.prismaService.client_data.findFirst({
        where: {
          user_id: userId,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      this.logger.error('findClientAndUser error:', error);
      const theEror = prismaErrorThrower(error, `find client and user!`);
      throw theEror;
    }
  }

  // update client
  // async updateClient(
  //   clientUserId: string,
  //   editRequest: edit_request[],
  //   bankInformation: CreateClientBankInformation[],
  //   denactiveAccount: boolean,
  // ) {
  //   try {
  //     return await this.prismaService.$transaction(async (prisma) => {
  //       if (editRequest) {
  //         await prisma.edit_request.createMany({
  //           data: editRequest,
  //         });
  //       }

  //       bankInformation.map(async (bankInfo) => {
  //         const bankInfoData =
  //           await this.prismaService.bank_information.findUnique({
  //             where: {
  //               id: bankInfo.id,
  //             },
  //           });

  //         //if it's found then update
  //         if (bankInfoData) {
  //           const updateBankInfo: Prisma.bank_informationUpdateInput = {};

  //           let isSame = true;
  //           if (bankInfo.card_image) {
  //             const sameUrl = await compareUrl(
  //               bankInfoData, // old object value
  //               bankInfo.card_image, // new object from request
  //             );
  //             if (!sameUrl) isSame = false;
  //           }

  //           // changes to new one if it's not the same
  //           if (!isSame) {
  //             updateBankInfo.card_image = {
  //               url: bankInfo.card_image.url,
  //               type: bankInfo.card_image.type,
  //               size: bankInfo.card_image.size,
  //             };
  //           }
  //           compareUrl(bankInfoData, bankInfo.card_image);

  //           bankInfo.bank_name &&
  //             (updateBankInfo.bank_name = bankInfo.bank_name);
  //           bankInfo.bank_account_name &&
  //             (updateBankInfo.bank_name = bankInfo.bank_name);
  //           bankInfo.bank_account_number &&
  //             (updateBankInfo.bank_name = bankInfo.bank_name);

  //           // update
  //           this.prismaService.bank_information.update({
  //             where: {
  //               id: bankInfo.id,
  //             },
  //             data: {
  //               ...updateBankInfo,
  //             },
  //           });
  //         } else {
  //           // if it doesn't exist then create
  //           this.prismaService.bank_information.create({
  //             data: {
  //               id: bankInfo.id,
  //               user_id: clientUserId,
  //               bank_name: bankInfo.bank_name,
  //               bank_account_name: bankInfo.bank_account_name,
  //               bank_account_number: bankInfo.bank_account_number,
  //               card_image: {
  //                 ...bankInfo.card_image,
  //               },
  //             },
  //           });
  //         }
  //       });

  //       if (denactiveAccount) {
  //         await prisma.user.update({
  //           where: {
  //             id: clientUserId,
  //           },
  //           data: {
  //             status_id: 'WAITING_FOR_EDITING_APPROVAL',
  //           },
  //         });
  //       }

  //       return editRequest;
  //     });
  //   } catch (error) {
  //     const theEror = prismaErrorThrower(error, `update client info!`);
  //     throw theEror;
  //   }
  // }

  async createUpdateRequest(
    clientUserId: string,
    editRequest: edit_request[],
    denactiveAccount: boolean,
  ) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        if (editRequest) {
          await prisma.edit_request.createMany({
            data: editRequest,
          });
        }

        if (denactiveAccount) {
          await prisma.user.update({
            where: {
              id: clientUserId,
            },
            data: {
              status_id: 'WAITING_FOR_EDITING_APPROVAL',
            },
          });
        }

        return editRequest;
      });
    } catch (error) {
      this.logger.error('createUpdateRequest error:', error);
      const theEror = prismaErrorThrower(error, `update client info!`);
      throw theEror;
    }
  }
}
