import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalCloseReportEntity } from 'src/proposal-management/closing-report/entity/proposal.close.report.entity';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
import { v4 as uuidv4 } from 'uuid';
export class ProposalCloseReportFindOneProps {
  id?: string;
  proposal_id?: string;
  include_relations?: string[];
  method?: 'AND' | 'OR';
}
export class ProposalCloseReportCreateProps {
  id?: string; // incase of predefined so it is optional
  execution_place: string;
  gender: string;
  number_of_beneficiaries: number;
  number_of_staff: number;
  number_of_volunteer: number;
  project_duration: string;
  number_project_duration: number;
  project_repeated: string;
  number_project_repeated: number;
  target_beneficiaries: string;
  proposal_id: string;
  attachments: UploadFilesJsonbDto[];
  images: UploadFilesJsonbDto[];
}
export class ProposalCloseReportUpdateProps {}
export class ProposalCloseReportFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class ProposalCloseReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ProposalCloseReportCreateProps,
    session?: PrismaService,
  ): Promise<ProposalCloseReportEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      // console.log('passed id', props.id);
      const rawCreated = await prisma.proposal_closing_report.create({
        data: {
          id: props.id || uuidv4(),
          execution_place: props.execution_place,
          gender: props.gender,
          number_of_beneficiaries: props.number_of_beneficiaries,
          number_of_staff: props.number_of_staff,
          number_of_volunteer: props.number_of_volunteer,
          project_duration: props.project_duration,
          number_project_duration: props.number_project_duration,
          project_repeated: props.project_repeated,
          number_project_repeated: props.number_project_repeated,
          target_beneficiaries: props.target_beneficiaries,
          proposal_id: props.proposal_id,
          attachments: props.attachments as unknown as Prisma.JsonArray,
          images: props.images as unknown as Prisma.JsonArray,
        },
      });

      const createdEntity = Builder<ProposalCloseReportEntity>(
        ProposalCloseReportEntity,
        {
          ...rawCreated,
        },
      ).build();
      // console.log('created close report', createdEntity);
      return createdEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async update(
    props: ProposalCloseReportUpdateProps,
    session?: PrismaService,
  ): Promise<ProposalCloseReportEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdated = await prisma.proposal_closing_report.update({
        where: {},
        data: {},
      });

      const updatedEntity = Builder<ProposalCloseReportEntity>(
        ProposalCloseReportEntity,
        {
          ...rawUpdated,
        },
      ).build();
      return updatedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findById(
    id: string,
    session?: PrismaService,
  ): Promise<ProposalCloseReportEntity | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const result = await prisma.proposal_closing_report.findFirst({
        where: { id: id },
      });
      if (!result) return null;
      return Builder<ProposalCloseReportEntity>(ProposalCloseReportEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  async findOneFilter(props: ProposalCloseReportFindOneProps) {
    // console.log('props', props);
    const { id, proposal_id, include_relations, method = 'AND' } = props;
    // console.log('method', method);
    try {
      const args: Prisma.proposal_closing_reportFindFirstArgs = {};
      const whereClause: Prisma.proposal_closing_reportWhereInput = {};
      if (!id && !proposal_id) {
        throw new PayloadErrorException('Please at least add one identifier');
      }

      let clause: Prisma.proposal_closing_reportWhereInput[] = [];
      if (id) clause.push({ id });
      if (proposal_id) clause.push({ proposal_id });
      if (method === 'AND') whereClause.AND = clause;
      if (method === 'OR') whereClause.OR = clause;

      args.where = whereClause;

      if (include_relations && include_relations.length > 0) {
        let include: Prisma.proposal_closing_reportInclude = {};

        for (const relation of include_relations) {
          if (relation === 'beneficiaries') {
            include = {
              ...include,
              beneficiaries: true,
            };
          }

          if (relation === 'execution_places') {
            include = {
              ...include,
              execution_places: true,
            };
          }

          if (relation === 'genders') {
            include = {
              ...include,
              genders: true,
            };
          }
        }

        args.include = include;
      }

      return args;
    } catch (error) {
      throw error;
    }
  }
  async findOne(
    props: ProposalCloseReportFindOneProps,
    session?: PrismaService,
  ): Promise<any | null> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const queryOptions = await this.findOneFilter(props);
      // console.log(
      //   'queryOptions on find one closing report',
      //   logUtil(queryOptions),
      // );
      const result = await prisma.proposal_closing_report.findFirst(
        queryOptions,
      );
      if (!result) return null;
      // console.log('raw find one closing report', result);
      return Builder<ProposalCloseReportEntity>(ProposalCloseReportEntity, {
        ...result,
      }).build();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }

  // async findMany(
  //   props: ProposalCloseReportFindManyProps,
  //   session?: PrismaService,
  // ): Promise<ProposalCloseReportEntity[]> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //     const { limit = 0, page = 0, sort_by, sort_direction } = props;
  //     const offset = (page - 1) * limit;
  //     const getSortBy = sort_by ? sort_by : 'created_at';
  //     const getSortDirection = sort_direction ? sort_direction : 'desc';

  //     let queryOptions: Prisma.proposal_closing_reportFindManyArgs = {
  //       where: clause,

  //       orderBy: {
  //         [getSortBy]: getSortDirection,
  //       },
  //     };

  //     if (limit > 0) {
  //       queryOptions = {
  //         ...queryOptions,
  //         skip: offset,
  //         take: limit,
  //       };
  //     }

  //     const rawProducts = await prisma.proposal_closing_report.findMany(
  //       queryOptions,
  //     );
  //     const productEntities = rawProducts.map((rawProducts) => {
  //       return Builder<CatalogProductEntity>(CatalogProductEntity, {
  //         ...rawProducts,
  //       }).build();
  //     });
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }

  // async countMany(
  //   props: ProposalCloseReportFindManyProps,
  //   session?: PrismaService,
  // ): Promise<number> {
  //   let prisma = this.prismaService;
  //   if (session) prisma = session;
  //   try {
  //   } catch (error) {
  //     console.trace(error);
  //     throw error;
  //   }
  // }
}
