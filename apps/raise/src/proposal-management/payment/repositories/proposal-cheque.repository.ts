import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ChequeEntity } from '../entities/cheque.entity';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { Prisma } from '@prisma/client';

export class ChequeCreateProps {
  id?: string; // opitonal incase of predifined
  payment_id: string;
  number: string;
  transfer_receipt: UploadFilesJsonbDto;
  deposit_date: Date;
}

@Injectable()
export class ProposalChequeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    props: ChequeCreateProps,
    session?: PrismaService,
  ): Promise<ChequeEntity> {
    let prisma = this.prismaService;
    if (session) prisma = session;

    try {
      const rawCreatedCheque = await prisma.cheque.create({
        data: {
          id: props.id || nanoid(),
          payment_id: props.payment_id,
          deposit_date: props.deposit_date,
          number: props.number,
          transfer_receipt:
            props.transfer_receipt as unknown as Prisma.InputJsonObject,
        },
      });

      const buildedEntity = Builder<ChequeEntity>(ChequeEntity, {
        ...rawCreatedCheque,
      }).build();

      return buildedEntity;
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
