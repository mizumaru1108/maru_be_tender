import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { UpdatePaymentDto } from '../dtos/requests/update-payment.dto';

export const CreateChequeMapper = (
  request: UpdatePaymentDto,
  chequeObj: UploadFilesJsonbDto,
): Prisma.chequeUncheckedCreateInput => {
  const chequeCreatePayload: Prisma.chequeUncheckedCreateInput = {
    id: nanoid(),
    deposit_date: request.cheque.deposit_date,
    number: request.cheque.number,
    payment_id: request.payment_id,
    transfer_receipt: {
      ...chequeObj,
    },
  };
  return chequeCreatePayload;
};
