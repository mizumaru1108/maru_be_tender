import { Injectable } from '@nestjs/common';
import {
  Prisma,
  bank_information,
  banks,
  client_data,
  user_status,
} from '@prisma/client';
import { Sql } from '@prisma/client/runtime';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { logUtil } from '../../../commons/utils/log-util';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { isUploadFileJsonb } from '../../../tender-commons/utils/is-upload-file-jsonb';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { SearchClientProposalFilter } from '../dtos/requests/search-client-proposal-filter-request.dto';
import { SearchEditRequestFilter } from '../dtos/requests/search-edit-request-filter-request.dto';
import { SearchSpecificClientProposalFilter } from '../dtos/requests/search-specific-client-proposal-filter-request.dto';
import { ClientDataEntity } from '../entities/client-data.entity';
export class CreateClientDataProps {
  id?: string;
  user_id: string;
  entity?: string | null;
  authority?: string | null;
  authority_id?: string | null;
  headquarters?: string | null;
  date_of_esthablistmen?: Date | null;
  num_of_beneficiaries?: number | null;
  num_of_employed_facility?: number | null;
  governorate?: string | null;
  governorate_id?: string | null;
  region?: string | null;
  region_id?: string | null;
  entity_mobile?: string | null;
  center_administration?: string | null;
  twitter_acount?: string | null;
  phone?: string | null;
  website?: string | null;
  password?: string | null;
  license_number?: string | null;
  license_expired?: Date | null;
  license_issue_date?: Date | null;
  ceo_mobile?: string | null;
  ceo_name?: string | null;
  data_entry_mobile?: string | null;
  data_entry_name?: string | null;
  data_entry_mail?: string | null;
  client_field?: string | null;
  client_field_id?: string | null;
  license_file?: any; // json
  board_ofdec_file?: any; // json
  chairman_name?: string | null;
  chairman_mobile?: string | null;
  qid?: number | null;
}
export class UpdateClientDataProps {
  id: string;
  user_id?: string;
  entity?: string | null;
  authority?: string | null;
  authority_id?: string | null;
  headquarters?: string | null;
  date_of_esthablistmen?: Date | null;
  num_of_beneficiaries?: number | null;
  num_of_employed_facility?: number | null;
  governorate?: string | null;
  governorate_id?: string | null;
  region?: string | null;
  region_id?: string | null;
  entity_mobile?: string | null;
  center_administration?: string | null;
  twitter_acount?: string | null;
  phone?: string | null;
  website?: string | null;
  password?: string | null;
  license_number?: string | null;
  license_expired?: Date | null;
  license_issue_date?: Date | null;
  ceo_mobile?: string | null;
  ceo_name?: string | null;
  data_entry_mobile?: string | null;
  data_entry_name?: string | null;
  data_entry_mail?: string | null;
  client_field?: string | null;
  client_field_id?: string | null;
  license_file?: any; // json
  board_ofdec_file?: any; // json
  chairman_name?: string | null;
  chairman_mobile?: string | null;
  qid?: number | null;
}

export class FindManyNameAndIdProps {
  user_name?: string;
  client_name?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

export class ClientDataFindManyProps {
  user_name?: string;
  client_name?: string;
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: string[];
}

export class ClientDataFindFirstProps {
  license_number?: string;
  user_id?: string;
  email?: string;
  client_id?: string;
  exclude_id?: string;
  include_relations?: string[];
}

@Injectable()
export class TenderClientRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderClientRepository.name,
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

  async create(props: CreateClientDataProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawCreatedClient = await prisma.client_data.create({
        data: {
          id: props.id || uuidv4(),
          user_id: props.user_id,
          entity: props.entity,
          authority: props.authority,
          authority_id: props.authority_id,
          headquarters: props.headquarters,
          date_of_esthablistmen: props.date_of_esthablistmen,
          num_of_beneficiaries: props.num_of_beneficiaries,
          num_of_employed_facility: props.num_of_employed_facility,
          governorate: props.governorate,
          governorate_id: props.governorate_id,
          region: props.region,
          region_id: props.region_id,
          entity_mobile: props.entity_mobile,
          center_administration: props.center_administration,
          twitter_acount: props.twitter_acount,
          phone: props.phone,
          website: props.website,
          password: props.password,
          license_number: props.license_number,
          license_expired: props.license_expired,
          license_issue_date: props.license_issue_date,
          ceo_mobile: props.ceo_mobile,
          ceo_name: props.ceo_name,
          data_entry_mobile: props.data_entry_mobile,
          data_entry_name: props.data_entry_name,
          data_entry_mail: props.data_entry_mail,
          client_field: props.client_field,
          client_field_id: props.client_field_id,
          license_file: props.license_file, // json
          board_ofdec_file: props.board_ofdec_file, // json
          chairman_name: props.chairman_name,
          chairman_mobile: props.chairman_mobile,
        },
      });

      const clientEntity = Builder<ClientDataEntity>(ClientDataEntity, {
        ...rawCreatedClient,
      }).build();

      return clientEntity;
    } catch (error) {
      throw error;
    }
  }

  async update(props: UpdateClientDataProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawUpdatedClient = await prisma.client_data.update({
        where: {
          id: props.id,
        },
        data: {
          user_id: props.user_id,
          entity: props.entity,
          authority: props.authority,
          authority_id: props.authority_id,
          headquarters: props.headquarters,
          date_of_esthablistmen: props.date_of_esthablistmen,
          num_of_beneficiaries: props.num_of_beneficiaries,
          num_of_employed_facility: props.num_of_employed_facility,
          governorate: props.governorate,
          governorate_id: props.governorate_id,
          region: props.region,
          region_id: props.region_id,
          entity_mobile: props.entity_mobile,
          center_administration: props.center_administration,
          twitter_acount: props.twitter_acount,
          phone: props.phone,
          website: props.website,
          password: props.password,
          license_number: props.license_number,
          license_expired: props.license_expired,
          license_issue_date: props.license_issue_date,
          ceo_mobile: props.ceo_mobile,
          ceo_name: props.ceo_name,
          data_entry_mobile: props.data_entry_mobile,
          data_entry_name: props.data_entry_name,
          data_entry_mail: props.data_entry_mail,
          client_field: props.client_field,
          client_field_id: props.client_field_id,
          license_file: props.license_file, // json
          board_ofdec_file: props.board_ofdec_file, // json
          chairman_name: props.chairman_name,
          chairman_mobile: props.chairman_mobile,
        },
      });

      const clientEntity = Builder<ClientDataEntity>(ClientDataEntity, {
        ...rawUpdatedClient,
      }).build();

      return clientEntity;
    } catch (error) {
      throw error;
    }
  }

  applyInclude(include_relations: string[]) {
    let args: Prisma.client_dataInclude = {};
    return args;
  }

  findFirstFilter(
    props: ClientDataFindFirstProps,
  ): Prisma.client_dataFindFirstArgs {
    const { include_relations } = props;

    const args: Prisma.client_dataFindFirstArgs = {};
    let whereClause: Prisma.client_dataWhereInput = {};

    if (props.license_number) whereClause.license_number = props.license_number;

    args.where = whereClause;

    if (include_relations && include_relations.length > 0) {
      args.include = this.applyInclude(include_relations);
    }

    return args;
  }

  async findFirst(
    props: ClientDataFindFirstProps,
    session?: PrismaService,
  ): Promise<ClientDataEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findFirstFilter(props);
      const rawRes = await prisma.user.findFirst({
        where: args.where,
        include: args.include,
      });

      if (!rawRes) return null;
      // console.log({ args });
      // console.log({ rawRes });
      const foundedEntity = Builder<ClientDataEntity>(ClientDataEntity, {
        ...rawRes,
      }).build();

      return foundedEntity;
    } catch (error) {
      throw error;
    }
  }

  async findManyFilter(props: ClientDataFindManyProps) {
    const args: Prisma.client_dataFindManyArgs = {};
    let whereClause: Prisma.client_dataWhereInput = {};
    if (props.client_name) {
      whereClause.entity = props.client_name;
    }
    if (props.user_name) {
      whereClause = {
        ...whereClause,
        user: {
          employee_name: props.user_name,
        },
      };
    }

    args.where = whereClause;
    return args;
  }

  async findManyNameAndId(
    props: FindManyNameAndIdProps,
    session?: PrismaService,
  ) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const options = await this.findManyFilter({
        client_name: props.client_name,
        user_name: props.user_name,
      });

      const { limit = 0, page = 0, sort_by, sort_direction } = props;
      const offset = (page - 1) * limit;
      const getSortBy = sort_by ? sort_by : 'created_at';
      const getSortDirection = sort_direction ? sort_direction : 'desc';

      // console.log(logUtil(options));
      let queryOptions: Prisma.client_dataFindManyArgs = {
        where: options.where,

        orderBy: {
          [getSortBy]: getSortDirection,
        },

        include: options.include,

        select: {
          id: true,
          user: {
            select: {
              id: true,
              employee_name: true,
            },
          },
        },
      };

      if (limit > 0) {
        queryOptions = {
          ...queryOptions,
          skip: offset,
          take: limit,
        };
      }

      // console.log(logUtil(queryOptions));
      const rawResults = await prisma.client_data.findMany(queryOptions);
      const entities = rawResults.map((rawResult) => {
        return Builder<ClientDataEntity>(ClientDataEntity, {
          ...rawResult,
        }).build();
      });

      return entities;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async countMany(props: ClientDataFindManyProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const args = await this.findManyFilter(props);
      return await prisma.client_data.count({
        where: args.where,
      });
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

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
        'validating user status!',
      );
      throw theError;
    }
  }

  async validateBankId(id: string): Promise<banks | null> {
    try {
      return await this.prismaService.banks.findUnique({
        where: { id },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'validateBankId error details: ',
        'validating bank id!',
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
          authority_id: true,
          board_ofdec_file: true,
          center_administration: true,
          ceo_mobile: true,
          ceo_name: true,
          chairman_mobile: true,
          chairman_name: true,
          client_field: true,
          client_field_id: true,
          data_entry_mail: true,
          data_entry_mobile: true,
          data_entry_name: true,
          date_of_esthablistmen: true,
          entity: true,
          entity_mobile: true,
          governorate: true,
          governorate_id: true,
          governorate_detail: true,
          headquarters: true,
          license_expired: true,
          license_file: true,
          license_issue_date: true,
          license_number: true,
          num_of_beneficiaries: true,
          num_of_employed_facility: true,
          phone: true,
          region: true,
          region_id: true,
          region_detail: true,
          twitter_acount: true,
          website: true,
          user: {
            select: {
              id: true,
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

  async findClientByMobileNum(mobile_number: string) {
    try {
      return await this.prismaService.client_data.findFirst({
        where: {
          entity_mobile: mobile_number,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'Find Client By Mobile Number error details: ',
        'Finding Client By Mobile Number!',
      );
      throw theError;
    }
  }

  async findMyProfile(userId: string) {
    try {
      return await this.prismaService.user.findFirst({
        where: {
          id: userId,
          // bank_information: {
          //   every: {
          //     is_deleted: {
          //       equals: false,
          //     },
          //   },
          // },
        },
        select: {
          email: true,
          client_data: {
            select: {
              headquarters: true,
              entity: true,
              num_of_beneficiaries: true,
              num_of_employed_facility: true,
              authority: true,
              date_of_esthablistmen: true,
              region: true,
              governorate: true,
              center_administration: true,
              website: true,
              twitter_acount: true,
              phone: true,
              ceo_mobile: true,
              ceo_name: true,
              data_entry_mobile: true,
              data_entry_name: true,
              data_entry_mail: true,
              license_number: true,
              license_expired: true,
              license_issue_date: true,
              license_file: true,
              chairman_name: true,
              chairman_mobile: true,
              entity_mobile: true,
              board_ofdec_file: true,
            },
          },
          bank_information: {
            where: {
              is_deleted: false,
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

  async countMyPendingLogs(userId: string, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      return await prisma.edit_requests.count({
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

  async findClientProposalById(filter: SearchSpecificClientProposalFilter) {
    const {
      user_id,
      page = 1,
      limit = 10,
      sort = 'desc',
      sorting_field,
    } = filter;

    const offset = (page - 1) * limit;

    let query: Prisma.proposalWhereInput = {
      step: 'ZERO',
    };

    if (user_id) {
      query = {
        ...query,
        submitter_user_id: user_id,
      };
    }

    const order_by: Prisma.proposalOrderByWithRelationInput = {};
    const field =
      sorting_field as keyof Prisma.proposalOrderByWithRelationInput;
    if (sorting_field) {
      order_by[field] = sort;
    } else {
      order_by.created_at = sort;
    }

    try {
      this.logger.log('info', 'finding porposal');
      const response = await this.prismaService.proposal.findMany({
        where: {
          ...query,
        },
        include: {
          user: {
            select: {
              employee_name: true,
              client_data: {
                include: {
                  authority_detail: true,
                  client_field_details: true,
                },
              },
              roles: true,
            },
          },
          follow_ups: true,
          proposal_item_budgets: true,
          proposal_logs: true,
          payments: true,
        },
        skip: offset,
        take: limit,
        orderBy: order_by,
      });

      const count = await this.prismaService.proposal.count({
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
        TenderClientRepository.name,
        'findUsers Error:',
        `finding users!`,
      );
      throw theError;
    }
  }

  async findClientProposals(filter: SearchClientProposalFilter) {
    const {
      page = 1,
      limit = 10,
      sort = 'desc',
      sorting_field,
      employee_name,
    } = filter;

    const offset = (page - 1) * limit;
    // In this code, whereClause is a variable that stores a SQL expression that will be used
    // in the WHERE clause of the SQL query. The initial value of 1 = 1 is a default value
    // that is always true, meaning it doesn't filter anything out.
    let whereClause: Sql = Prisma.sql`1 = 1`;

    const order_by: Prisma.client_dataOrderByWithRelationInput = {};
    const field =
      sorting_field as keyof Prisma.client_dataOrderByWithRelationInput;
    if (sorting_field) {
      order_by[field] = sort;
    } else {
      order_by.created_at = sort;
    }

    if (employee_name && employee_name !== '') {
      // || is equals to concat in sql (. operator in php, + operator in javascript)
      whereClause = Prisma.sql`client_data.entity LIKE '%' || ${employee_name} || '%'`;
    }

    try {
      const response: any = await this.prismaService.$queryRaw`
        SELECT "user".id, "user".email, "user".status_id, client_data.entity as employee_name, client_data.entity_mobile as mobile_number,
        client_data.governorate, COUNT(proposal.id) AS proposal_count, COUNT(*) OVER() AS total_count
        FROM client_data
        JOIN "user" ON client_data.user_id = "user".id
        LEFT JOIN proposal ON proposal.submitter_user_id = client_data.user_id AND proposal.step = 'ZERO'
        WHERE ${whereClause}
        GROUP BY client_data.id, "user".id
        LIMIT ${limit} OFFSET ${offset};
      `;

      return response;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderClientRepository.name,
        'findClientProposals Error:',
        `findClientProposals users!`,
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
        TenderClientRepository.name,
        'findUsers Error:',
        `finding users!`,
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
    deletedFileManagerUrls: string[],
    passedSession?: Prisma.TransactionClient,
  ) {
    try {
      if (passedSession) {
        const updatedEditRequest = await passedSession.edit_requests.update({
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

        if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
          await passedSession.file_manager.updateMany({
            where: {
              url: {
                in: [...deletedFileManagerUrls],
              },
            },
            data: {
              is_deleted: true,
            },
          });
        }

        return updatedEditRequest;
      } else {
        return await this.prismaService.$transaction(async (prisma) => {
          const updatedEditRequest = await prisma.edit_requests.update({
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

          if (deletedFileManagerUrls && deletedFileManagerUrls.length > 0) {
            await prisma.file_manager.updateMany({
              where: {
                url: {
                  in: [...deletedFileManagerUrls],
                },
              },
              data: {
                is_deleted: true,
              },
            });
          }

          return updatedEditRequest;
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
    updateUserPayload: Prisma.userUncheckedUpdateInput | undefined,
    created_bank: Prisma.bank_informationCreateManyInput[],
    updated_bank: bank_information[],
    deleted_bank: bank_information[],
    deletedFileManagerUrls: string[],
  ) {
    try {
      return await this.prismaService.$transaction(
        async (prisma) => {
          if (updateClientPayload) {
            this.logger.log(
              'info',
              `updating client data with payload of \n${logUtil(
                updateClientPayload,
              )}`,
            );
            await prisma.client_data.update({
              where: {
                user_id,
              },
              data: {
                ...updateClientPayload,
              },
            });
          }

          if (updateUserPayload) {
            this.logger.log(
              'info',
              `updating client data with payload of ${logUtil(
                updateUserPayload,
              )}, also re-active the user`,
            );
            await prisma.user.update({
              where: {
                id: user_id,
              },
              data: {
                ...updateUserPayload,
              },
            });

            await this.fusionAuthService.fusionAuthUpdateUser(user_id, {
              firstName:
                updateUserPayload.employee_name &&
                !!updateUserPayload.employee_name
                  ? (updateUserPayload.employee_name as string)
                  : undefined,
              mobilePhone:
                updateUserPayload.mobile_number &&
                !!updateUserPayload.mobile_number
                  ? (updateUserPayload.mobile_number as string)
                  : undefined,
            });
          }

          if (created_bank && created_bank.length > 0) {
            this.logger.log(
              'info',
              `create .., payload: ${logUtil(created_bank)}`,
            );
            await prisma.bank_information.createMany({
              data: created_bank,
            });
          }

          if (updated_bank && updated_bank.length > 0) {
            for (let i = 0; i < updated_bank.length; i++) {
              this.logger.log(
                'info',
                `updating bank ${updated_bank[i].id}, payload: ${logUtil(
                  updated_bank[i],
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
                  bank_id: updated_bank[i].bank_id,
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

                // console.log(logUtil(updatedBank));
              }

              const { url } = deleted_bank[i].card_image as any;
              const oldFileManager = await prisma.file_manager.findUnique({
                where: {
                  url,
                },
              });

              if (oldFileManager !== null) {
                await prisma.file_manager.update({
                  where: {
                    url,
                  },
                  data: {
                    is_deleted: true,
                  },
                });
                // console.log(logUtil(fileM));
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
            [],
            prisma,
          );

          // throw new BadRequestException('on debugging!');
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
