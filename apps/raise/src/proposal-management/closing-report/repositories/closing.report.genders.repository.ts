import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClosingReportGendersEntity } from 'src/proposal-management/closing-report/entity/closing.report.genders.entity';

export class ClosingReportGendersCreateProps {
  id?: string;
  closing_report_id: string;
  selected_values: string;
  selected_numbers: number;
}

export class ClosingReportGendersUpdateProps {}

export class ClosingReportGendersFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class ClosingReportGendersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ClosingReportGendersCreateProps,
    session?: PrismaService,
  ): Promise<ClosingReportGendersEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.closingReportGenders.create({
        data: {
          id: props.id || nanoid(),
          closing_report_id: props.closing_report_id,
          selected_values: props.selected_values,
          selected_numbers: props.selected_numbers,
        },
      });

      const createdEntity = Builder<ClosingReportGendersEntity>(
        ClosingReportGendersEntity,
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
}
