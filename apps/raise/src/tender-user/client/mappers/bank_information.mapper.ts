import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RegisterTenderDto } from '../../../tender-auth/dtos/requests/register-tender.dto';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';

export const BankInformationsMapper = (
  user_id: string,
  request: RegisterTenderDto['data']['bank_informations'],
  bankCardObj: UploadFilesJsonbDto | undefined,
): Prisma.bank_informationUncheckedCreateInput => {
  const bankData: Prisma.bank_informationUncheckedCreateInput = {
    id: uuidv4(),
    user_id,
    bank_id: request.bank_id,
    bank_name: request.bank_name,
    bank_account_number: request.bank_account_number,
    bank_account_name: request.bank_account_name,
    card_image: bankCardObj && {
      ...bankCardObj,
    },
  };

  return bankData;
};
