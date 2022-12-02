import { Injectable, NotFoundException } from '@nestjs/common';
import { client_data, edit_request, Prisma, user_status } from '@prisma/client';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { TenderUserRepository } from '../../user/repositories/tender-user.repository';

@Injectable()
export class TenderClientRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderClientRepository.name,
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly tenderUserRepository: TenderUserRepository,
  ) {}

  async validateStatus(status: string): Promise<user_status | null> {
    try {
      return await this.prismaService.user_status.findUnique({
        where: { id: status },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'validateStatus error details: ',
        'find client and user!',
      );
      throw theError;
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
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'findClient error details: ',
        'finding client',
      );
      throw theError;
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
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'findClientAndUser error details: ',
        'find client and user!',
      );
      throw theError;
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
    editRequest: Prisma.edit_requestCreateInput[],
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
          await this.tenderUserRepository.changeUserStatus(
            clientUserId,
            'WAITING_FOR_EDITING_APPROVAL',
          );
        }

        return editRequest;
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'createUpdateRequest error details: ',
        'requiesting field change!',
      );
      throw theError;
    }
  }

  async findUpdateRequestById(id: string) {
    try {
      return await this.prismaService.edit_request.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'validateStatus error details: ',
        'find client and user!',
      );
      throw theError;
    }
  }

  async getRemainingUpdateRequestCount(
    userId: string,
    prismaSession?: Prisma.TransactionClient,
  ) {
    try {
      if (prismaSession) {
        return await prismaSession.edit_request.count({
          where: {
            user_id: userId,
            approval_status: {
              equals: 'WAITING_FOR_APPROVAL',
            },
          },
        });
      } else {
        return await this.prismaService.edit_request.count({
          where: {
            user_id: userId,
            approval_status: {
              equals: 'WAITING_FOR_APPROVAL',
            },
          },
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'getRemainingUpdateRequestCount error details: ',
        'fetching remaining update request count!',
      );
      throw theError;
    }
  }

  async changeEditRequestStatus(
    requestId: string,
    reviewerId: string,
    status: string,
    prismaSession?: Prisma.TransactionClient,
  ) {
    this.logger.log(
      'info',
      `changing edit request status to ${status}, using prisma session: ${
        prismaSession ? true : false
      }`,
    );
    try {
      if (prismaSession) {
        return await prismaSession.edit_request.update({
          where: {
            id: requestId,
          },
          data: {
            approval_status: {
              set: status,
            },
            reviewer_id: reviewerId,
          },
        });
      } else {
        return await this.prismaService.edit_request.update({
          where: {
            id: requestId,
          },
          data: {
            approval_status: {
              set: status,
            },
            reviewer_id: reviewerId,
          },
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'changeEditRequestStatus error details: ',
        'changing edit request status!',
      );
      throw theError;
    }
  }

  async updateClientField(
    userId: string,
    fieldName: string,
    fieldValue: number | string | boolean | Date | Object,
    prismaSession?: Prisma.TransactionClient,
  ) {
    this.logger.log(
      'info',
      `updating client field ${fieldName} with value ${fieldValue}, using session: ${
        prismaSession ? true : false
      }`,
    );
    try {
      if (prismaSession) {
        return await prismaSession.client_data.update({
          where: {
            user_id: userId,
          },
          data: {
            [fieldName]: fieldValue,
          },
        });
      } else {
        return await this.prismaService.client_data.update({
          where: {
            user_id: userId,
          },
          data: {
            [fieldName]: fieldValue,
          },
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'updateClientField error details: ',
        'updating client field!',
      );
      throw theError;
    }
  }

  async appoveUpdateRequest(
    currentEditRequest: edit_request,
    reviewerId: string,
    parsedValue: number | string | boolean | Date | Object,
  ) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await this.updateClientField(
          currentEditRequest.user_id,
          currentEditRequest.field_name,
          parsedValue,
          prisma,
        );

        await this.changeEditRequestStatus(
          currentEditRequest.id,
          reviewerId,
          'APPROVED',
          prisma,
        );
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'appoveUpdateRequest error details: ',
        'approving update request!',
      );
      throw theError;
    }
  }
}
