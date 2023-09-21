import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { BankInformationEntity } from '../entities/bank-information.entity';
import { UploadFilesJsonbDto } from '../../tender-commons/dto/upload-files-jsonb.dto';
import { Prisma } from '@prisma/client';

export class BankInformationCreateProps {
  id?: string; // incase if id is predefined
  user_id: string;
  bank_id: string; // refer to bank
  bank_account_name: string;
  bank_account_number: string;
  card_image: UploadFilesJsonbDto | null;
}
export class BankInformationUpdateProps {
  id: string; // incase if id is predefined
  user_id?: string;
  bank_id?: string; // refer to bank
  bank_account_name?: string;
  bank_account_number?: string;
  card_image?: UploadFilesJsonbDto | null;
}

@Injectable()
export class BankInformationRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': BankInformationRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async create(props: BankInformationCreateProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawCreatedBank = await prisma.bank_information.create({
        data: {
          id: props.id || uuidv4(),
          bank_id: props.bank_id,
          user_id: props.user_id,
          bank_account_name: props.bank_account_name,
          bank_account_number: props.bank_account_number,
          card_image: props.card_image
            ? ({ ...props.card_image } as Prisma.InputJsonValue)
            : undefined,
        },
      });

      const createdBankEntity = Builder<BankInformationEntity>(
        BankInformationEntity,
        rawCreatedBank,
      ).build();

      return createdBankEntity;
    } catch (error) {
      this.logger.log('info', `error while creating bank information ${error}`);
      throw error;
    }
  }

  async update(props: BankInformationUpdateProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawUpdatedBank = await prisma.bank_information.update({
        where: {
          id: props.id,
        },
        data: {
          bank_id: props.bank_id,
          user_id: props.user_id,
          bank_account_name: props.bank_account_name,
          bank_account_number: props.bank_account_number,
          card_image: props.card_image
            ? ({ ...props.card_image } as Prisma.InputJsonValue)
            : undefined,
        },
      });

      const updatedBankEntity = Builder<BankInformationEntity>(
        BankInformationEntity,
        rawUpdatedBank,
      ).build();

      return updatedBankEntity;
    } catch (error) {
      this.logger.log('info', `error while updating bank information ${error}`);
      throw error;
    }
  }
}
