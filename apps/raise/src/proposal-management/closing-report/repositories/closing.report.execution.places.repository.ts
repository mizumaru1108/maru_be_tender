import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClosingReportExecutionPlacesEntity } from 'src/proposal-management/closing-report/entity/closing.report.execution.places.entity';

export class ClosingReportExecutionPlacesCreateProps {
  id?: string;
  closing_report_id: string;
  selected_values: string;
  selected_numbers: number;
}

export class ClosingReportExecutionPlacesUpdateProps {}

export class ClosingReportExecutionPlacesFindManyProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}

@Injectable()
export class ClosingReportExecutionPlacesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ClosingReportExecutionPlacesCreateProps,
    session?: PrismaService,
  ): Promise<ClosingReportExecutionPlacesEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreated = await prisma.closingReportExecutionPlaces.create({
        data: {
          id: props.id || nanoid(),
          closing_report_id: props.closing_report_id,
          selected_values: props.selected_values,
          selected_numbers: props.selected_numbers,
        },
      });

      const createdEntity = Builder<ClosingReportExecutionPlacesEntity>(
        ClosingReportExecutionPlacesEntity,
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
