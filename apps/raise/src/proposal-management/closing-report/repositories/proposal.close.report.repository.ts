import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Builder } from 'builder-pattern';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalCloseReportEntity } from 'src/proposal-management/closing-report/entity/proposal.close.report.entity';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { v4 as uuidv4 } from 'uuid';

export class ProposalCloseReportCreateProps {
  id?: string; // incase of predefined so it is optional
  execution_place: string;
  gender: string;
  number_of_beneficiaries: number;
  number_of_staff: number;
  number_of_volunteer: number;
  project_duration: string;
  project_repeated: string;
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
      const rawCreated = await prisma.proposal_closing_report.create({
        data: {
          id: props.id || uuidv4(),
          execution_place: props.execution_place,
          gender: props.gender,
          number_of_beneficiaries: props.number_of_beneficiaries,
          number_of_staff: props.number_of_staff,
          number_of_volunteer: props.number_of_volunteer,
          project_duration: props.project_duration,
          project_repeated: props.project_repeated,
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
