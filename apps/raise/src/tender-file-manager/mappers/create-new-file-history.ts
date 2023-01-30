import { Prisma } from '@prisma/client';
import { CreateNewFileHistoryDto } from '../dtos/requests/create-new-file-history.dto';
import { v4 as uuidv4 } from 'uuid';

export const CreateNewFileHistoryMapper = (
  userId: string,
  request: CreateNewFileHistoryDto,
) => {
  const createPayload: Prisma.file_managerUncheckedCreateInput = {
    id: uuidv4(),
    name: request.name,
    size: request.size,
    url: request.url,
    mimetype: request.mimetype,
    column_name: request.coulumn_name,
    table_name: request.table_name,
    user_id: userId,
  };

  return createPayload;
};
