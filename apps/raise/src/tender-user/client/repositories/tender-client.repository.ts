import { BadRequestException, Injectable } from '@nestjs/common';
import {
  bank_information,
  client_data,
  Prisma,
  user_status,
} from '@prisma/client';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { UploadFilesDto } from '../../../tender-commons/dto/upload-files.dto';
import { isUploadFileJsonb } from '../../../tender-commons/utils/is-upload-file-jsonb';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { TenderUserRepository } from '../../user/repositories/tender-user.repository';
import { SearchEditRequestFilter } from '../dtos/requests/search-edit-request-filter-request.dto';

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
          authority: true,
          board_ofdec_file: true,
          center_administration: true,
          ceo_mobile: true,
          ceo_name: true,
          chairman_mobile: true,
          chairman_name: true,
          client_field: true,
          data_entry_mail: true,
          data_entry_mobile: true,
          data_entry_name: true,
          date_of_esthablistmen: true,
          entity: true,
          governorate: true,
          headquarters: true,
          license_expired: true,
          license_file: true,
          license_issue_date: true,
          license_number: true,
          num_of_beneficiaries: true,
          num_of_employed_facility: true,
          phone: true,
          region: true,
          twitter_acount: true,
          website: true,
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
    fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[],
  ) {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const createdEditRequest = await prisma.edit_requests.create({
          data: editRequestLogPayload,
          include: {
            user: true,
          },
        });

        if (
          fileManagerCreateManyPayload &&
          fileManagerCreateManyPayload.length > 0
        ) {
          await prisma.file_manager.createMany({
            data: fileManagerCreateManyPayload,
          });
        }

        return createdEditRequest;
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

  async updateById(
    id: string,
    updatePayload: Prisma.edit_requestsUncheckedUpdateInput,
    passedSession?: Prisma.TransactionClient,
  ) {
    try {
      if (passedSession) {
        return await passedSession.edit_requests.update({
          where: {
            id,
          },
          data: {
            ...updatePayload,
          },
          include: {
            user: true,
            reviewer: true,
          },
        });
      } else {
        return await this.prismaService.edit_requests.update({
          where: {
            id,
          },
          data: {
            ...updatePayload,
          },
          include: {
            user: true,
            reviewer: true,
          },
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'Update Edit Request Error details: ',
        'Updating edit request!',
      );
      throw theError;
    }
  }

  async approveEditRequests(
    request_id: string,
    reviewer_id: string,
    user_id: string,
    updateClientPayload: Prisma.client_dataUncheckedUpdateInput | undefined,
    created_bank: Prisma.bank_informationCreateManyInput[],
    updated_bank: bank_information[],
    deleted_bank: bank_information[],
    deletedFileManagerUrls: string[],
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.client_data.update({
            where: {
              user_id,
            },
            data: {
              ...updateClientPayload,
            },
          });

          if (created_bank && created_bank.length > 0) {
            this.logger.log(
              'info',
              `create .., payload: ${JSON.stringify(created_bank, null, 2)}`,
            );
            await prisma.bank_information.createMany({
              data: created_bank,
            });
          }

          if (updated_bank && updated_bank.length > 0) {
            for (let i = 0; i < updated_bank.length; i++) {
              this.logger.log(
                'info',
                `updating bank ${updated_bank[i].id}, payload: ${JSON.stringify(
                  updated_bank[i],
                  null,
                  2,
                )}`,
              );
              const oldBank = await prisma.bank_information.findUnique({
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
                  const oldData = await prisma.file_manager.findUnique({
                    where: {
                      url: tmpOldbank.url,
                    },
                  });

                  if (oldData !== null) {
                    await prisma.file_manager.update({
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

              await prisma.bank_information.update({
                where: {
                  id: updated_bank[i].id,
                },
                data: {
                  user_id: updated_bank[i].user_id,
                  bank_name: updated_bank[i].bank_name,
                  bank_account_name: updated_bank[i].bank_account_name,
                  bank_account_number: updated_bank[i].bank_account_number,
                  card_image: updated_bank[i].card_image,
                } as Prisma.bank_informationUncheckedUpdateInput,
              });
            }
          }

          if (deleted_bank && deleted_bank.length > 0) {
            for (let i = 0; i < deleted_bank.length; i++) {
              this.logger.log(
                'info',
                `setting flag delete for bank ${deleted_bank[i].id} ...`,
              );
              const oldBank = await prisma.bank_information.findUnique({
                where: {
                  id: deleted_bank[i].id,
                },
              });

              if (!!oldBank) {
                await prisma.bank_information.update({
                  where: {
                    id: deleted_bank[i].id,
                  },
                  data: {
                    is_deleted: true,
                  },
                });
              }

              const { url } = deleted_bank[i].card_image as any;
              const oldFileManager = prisma.file_manager.findUnique({
                where: {
                  url,
                },
              });

              if (oldFileManager !== null) {
                prisma.file_manager.update({
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

          if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
            for (let i = 0; i < deletedFileManagerUrls.length; i++) {
              const fileManager = await prisma.file_manager.findFirst({
                where: { url: deletedFileManagerUrls[i] },
              });
              if (fileManager) {
                this.logger.log(
                  'info',
                  `setting deleted flag for ${deletedFileManagerUrls[i]}`,
                );
                await prisma.file_manager.update({
                  where: { url: deletedFileManagerUrls[i] },
                  data: { is_deleted: true },
                });
              }
            }
          }

          this.logger.log('info', 'Approving edit request status...');
          const editRequestResult = await this.updateById(
            request_id,
            {
              reviewer_id,
              status_id: 'APPROVED',
              accepted_at: new Date(),
            },
            prisma,
          );

          return editRequestResult;
        },
        {
          maxWait: 50000,
          timeout: 150000,
        },
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
