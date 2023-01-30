import { Prisma } from '@prisma/client';
import { CreateNewFileHistoryDto } from '../dtos/requests/create-new-file-history.dto';
import { v4 as uuidv4 } from 'uuid';

export const CreateManyNewFileHistoryMapper = (
  userId: string,
  requests: CreateNewFileHistoryDto[],
) => {
  const createPayload: Prisma.file_managerCreateManyInput[] = requests.map(
    (request: CreateNewFileHistoryDto) => {
      return {
        id: uuidv4(),
        name: request.name,
        url: request.url,
        column_name: request.coulumn_name,
        table_name: request.table_name,
        mimetype: request.mimetype,
        size: request.size,
        user_id: userId,
      };
    },
  );
  return createPayload;
};
