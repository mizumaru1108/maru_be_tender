import { Injectable } from '@nestjs/common';
import {
  bank_information,
  client_data,
  Prisma,
  user,
  user_status,
} from '@prisma/client';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { TenderUserRepository } from '../../user/repositories/tender-user.repository';
import { SearchEditRequestFilter } from '../dtos/requests/search-edit-request-filter-request.dto';
import { UpdateBankInfoPayload } from '../interfaces/update-bank-info-payload.interface';

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

  async findBanksByUserId(userId: string) {
    try {
      return await this.prismaService.bank_information.findMany({
        where: {
          user_id: userId,
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

  async findClientDataByUserId(userId: string) {
    try {
      return await this.prismaService.client_data.findFirst({
        where: {
          user_id: userId,
        },
        select: {
          entity: true,
          authority: true,
          date_of_esthablistmen: true,
          headquarters: true,
          num_of_employed_facility: true,
          num_of_beneficiaries: true,
          region: true,
          governorate: true,
          center_administration: true,
          entity_mobile: true,
          phone: true,
          twitter_acount: true,
          website: true,
          license_number: true,
          license_issue_date: true,
          license_expired: true,
          license_file: true,
          board_ofdec_file: true,
          ceo_name: true,
          ceo_mobile: true,
          data_entry_name: true,
          data_entry_mobile: true,
          data_entry_mail: true,
          // chairman_name: true,
          // chairman_mobile: true,
          client_field: true,
          user: {
            select: {
              status_id: true,
            },
          },
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

  async countMyPendingLogs(userId: string) {
    try {
      return await this.prismaService.edit_requests.count({
        where: {
          user_id: userId,
          status_id: {
            contains: 'PENDING',
            mode: 'insensitive',
          },
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

  async findEditRequestLogsByRequestId(id: string) {
    try {
      return await this.prismaService.edit_requests.findMany({
        where: {
          id,
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

  // async findEditRequestLogById(
  //   log_id: string,
  // ): Promise<RawEditRequestByLogIdDto['data']> {
  //   try {
  //     return await this.prismaService.edit_requests.findUnique({
  //       where: {
  //         id: log_id,
  //       },
  //       include: {
  //         user: {
  //           select: {
  //             client_data: true,
  //             bank_information: true,
  //           },
  //         },
  //         edit_requests: true,
  //       },
  //     });
  //   } catch (error) {
  //     const theError = prismaErrorThrower(
  //       error,
  //       TenderClientRepository.name,
  //       'findClientAndUser error details: ',
  //       'find client and user!',
  //     );
  //     throw theError;
  //   }
  // }

  async findEditRequestLogByRequestId(id: string) {
    try {
      return await this.prismaService.edit_requests.findFirst({
        where: {
          id,
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

  async findEditRequests(filter: SearchEditRequestFilter) {
    const {
      association_name,
      status,
      page = 1,
      limit = 10,
      sort = 'desc',
      sorting_field,
    } = filter;

    const offset = (page - 1) * limit;

    let query: Prisma.edit_requestsWhereInput = {};

    if (association_name) {
      query = {
        ...query,
        user: {
          client_data: {
            entity: {
              contains: association_name,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    if (status) {
      query = {
        ...query,
        status_id: {
          contains: status,
          mode: 'insensitive',
        },
      };
    }

    const order_by: Prisma.edit_requestsOrderByWithRelationInput = {};
    const field =
      sorting_field as keyof Prisma.edit_requestsOrderByWithRelationInput;
    if (sorting_field) {
      order_by[field] = sort;
    } else {
      order_by.created_at = sort;
    }

    try {
      const response = await this.prismaService.edit_requests.findMany({
        where: {
          ...query,
        },
        select: {
          id: true,
          status_id: true,
          created_at: true,
          user: {
            select: {
              client_data: {
                select: {
                  entity: true,
                },
              },
            },
          },
          // edit_requests: true,
        },
        skip: offset,
        take: limit,
        orderBy: order_by,
      });

      const count = await this.prismaService.edit_requests.count({
        where: {
          ...query,
        },
      });

      return {
        data: response,
        total: count,
      };
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderUserRepository.name,
        'findUsers Error:',
        `finding users!`,
      );
      throw theError;
    }
  }

  async createUpdateRequest(
    editRequestLogPayload: Prisma.edit_requestsUncheckedCreateInput,
  ) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        return await prisma.edit_requests.create({
          data: editRequestLogPayload,
        });
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
      return await this.prismaService.edit_requests.findUnique({
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

  // async findUnapprovedEditRequestByUserId(
  //   userId: string,
  // ): Promise<edit_request[]> {
  //   try {
  //     return await this.prismaService.edit_request.findMany({
  //       where: {
  //         user_id: userId,
  //         approval_status: 'WAITING_FOR_APPROVAL',
  //       },
  //     });
  //   } catch (error) {
  //     const theError = prismaErrorThrower(
  //       error,
  //       TenderClientRepository.name,
  //       'findUnapprovedEditRequestByUserId error details: ',
  //       'finding update requests!',
  //     );
  //     throw theError;
  //   }
  // }

  // async getRemainingUpdateRequestCount(
  //   userId: string,
  //   prismaSession?: Prisma.TransactionClient,
  // ) {
  //   this.logger.log(
  //     'info',
  //     `get remaining edit request for user (${userId}), with prisma session: ${
  //       prismaSession ? true : false
  //     }`,
  //   );
  //   try {
  //     if (prismaSession) {
  //       return await prismaSession.edit_request.findMany({
  //         where: {
  //           user_id: userId,
  //           approval_status: {
  //             equals: 'WAITING_FOR_APPROVAL',
  //           },
  //         },
  //       });
  //     } else {
  //       return await this.prismaService.edit_request.findMany({
  //         where: {
  //           user_id: userId,
  //           approval_status: {
  //             equals: 'WAITING_FOR_APPROVAL',
  //           },
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     const theError = prismaErrorThrower(
  //       error,
  //       TenderClientRepository.name,
  //       'getRemainingUpdateRequestCount error details: ',
  //       'fetching remaining update request count!',
  //     );
  //     throw theError;
  //   }
  // }

  // async changeEditRequestStatus(
  //   requestId: string,
  //   reviewerId: string,
  //   status: string,
  //   prismaSession?: Prisma.TransactionClient,
  // ) {
  //   this.logger.log(
  //     'info',
  //     `changing edit request status to ${status}, using prisma session: ${
  //       prismaSession ? true : false
  //     }`,
  //   );
  //   try {
  //     if (prismaSession) {
  //       return await prismaSession.edit_request.update({
  //         where: {
  //           id: requestId,
  //         },
  //         data: {
  //           approval_status: {
  //             set: status,
  //           },
  //           reviewer_id: reviewerId,
  //         },
  //       });
  //     } else {
  //       return await this.prismaService.edit_request.update({
  //         where: {
  //           id: requestId,
  //         },
  //         data: {
  //           approval_status: {
  //             set: status,
  //           },
  //           reviewer_id: reviewerId,
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     const theError = prismaErrorThrower(
  //       error,
  //       TenderClientRepository.name,
  //       'changeEditRequestStatus error details: ',
  //       'changing edit request status!',
  //     );
  //     throw theError;
  //   }
  // }

  // async changeEditRequestStatusByUserId(
  //   userId: string,
  //   reviewerId: string,
  //   status: ApprovalStatus,
  //   prismaSession?: Prisma.TransactionClient,
  // ) {
  //   this.logger.log(
  //     'info',
  //     `changing edit request status to ${status}, using prisma session: ${
  //       prismaSession ? true : false
  //     }`,
  //   );
  //   try {
  //     if (prismaSession) {
  //       return await prismaSession.edit_request.updateMany({
  //         where: {
  //           user_id: userId,
  //         },
  //         data: {
  //           approval_status: {
  //             set: status as string,
  //           },
  //           reviewer_id: reviewerId,
  //         },
  //       });
  //     } else {
  //       return await this.prismaService.edit_request.updateMany({
  //         where: {
  //           user_id: userId,
  //         },
  //         data: {
  //           approval_status: {
  //             set: status as string,
  //           },
  //           reviewer_id: reviewerId,
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     const theError = prismaErrorThrower(
  //       error,
  //       TenderClientRepository.name,
  //       'changeEditRequestStatusByUserId error details: ',
  //       'changing edit request status!',
  //     );
  //     throw theError;
  //   }
  // }

  async updateClientFieldByKeyValuePair(
    userId: string,
    updatePayload: Record<string, any>,
    prismaSession?: Prisma.TransactionClient,
  ) {
    // log the key and the value
    Object.keys(updatePayload).forEach((key) => {
      this.logger.log(
        'info',
        `updating client field ${key} with value ${updatePayload[key]}`,
      );
    });

    try {
      if (prismaSession) {
        return await prismaSession.client_data.update({
          where: {
            user_id: userId,
          },
          data: {
            ...updatePayload,
          },
        });
      } else {
        return await this.prismaService.client_data.update({
          where: {
            user_id: userId,
          },
          data: {
            ...updatePayload,
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

  // for accepting one by one
  // async appoveUpdateRequest(
  //   currentEditRequest: edit_request,
  //   reviewerId: string,
  //   parsedValue: number | string | boolean | Date | Object,
  // ) {
  //   try {
  //     return await this.prismaService.$transaction(async (prisma) => {
  //       await this.updateClientField(
  //         currentEditRequest.user_id,
  //         currentEditRequest.field_name,
  //         parsedValue,
  //         prisma,
  //       );

  //       await this.changeEditRequestStatus(
  //         currentEditRequest.id,
  //         reviewerId,
  //         'APPROVED',
  //         prisma,
  //       );
  //     });
  //   } catch (error) {
  //     const theError = prismaErrorThrower(
  //       error,
  //       TenderClientRepository.name,
  //       'appoveUpdateRequest error details: ',
  //       'approving update request!',
  //     );
  //     throw theError;
  //   }
  // }

  async approveEditRequests(
    userId: string,
    reviewerId: string,
    updateClientPayload: Record<string, any>,
    updateUserPayload: Record<string, any>,
    createBankInfoPayload: Prisma.bank_informationCreateInput[],
    updateBankInfoPayload: UpdateBankInfoPayload[],
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          let updatedClient: client_data | null = null;
          if (Object.keys(updateClientPayload).length > 0) {
            updatedClient = await this.updateClientFieldByKeyValuePair(
              userId,
              updateClientPayload,
              prisma,
            );
          }

          let updatedUser: user | null = null;
          if (Object.keys(updateUserPayload).length > 0) {
            updatedUser =
              await this.tenderUserRepository.updateUserFieldByKeyValuePair(
                userId,
                updateUserPayload,
                prisma,
              );
          }

          let createdBankInformations: bank_information[] | null = null;
          if (createBankInfoPayload.length > 0) {
            const createdBankInfos = createBankInfoPayload.map(
              async (bankInfo) => {
                return await this.tenderUserRepository.createUserBankAccount(
                  userId,
                  bankInfo,
                  prisma,
                );
              },
            );
            createdBankInformations = await Promise.all(createdBankInfos);
          }

          let updatedBankInformations: bank_information[] | null = null;
          if (updateBankInfoPayload.length > 0) {
            const updatedBankInfos = updateBankInfoPayload.map(
              async (bankInfo) => {
                return await this.tenderUserRepository.updateBankAccount(
                  bankInfo._id,
                  bankInfo.data,
                  prisma,
                );
              },
            );
            updatedBankInformations = await Promise.all(updatedBankInfos);
          }

          /* approve all request */
          // await this.changeEditRequestStatusByUserId(
          //   userId,
          //   reviewerId,
          //   'APPROVED',
          //   prisma,
          // );

          /* active the account */
          await this.tenderUserRepository.changeUserStatus(
            userId,
            'ACTIVE_ACCOUNT',
            prisma,
            reviewerId,
          );

          return {
            updatedClient,
            updatedUser,
            createdBankInformations,
            updatedBankInformations,
          };
        },
        { maxWait: 50000, timeout: 150000 },
      );
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'approveEditRequests error details: ',
        'approving edit requests!',
      );
      throw theError;
    }
  }
}
