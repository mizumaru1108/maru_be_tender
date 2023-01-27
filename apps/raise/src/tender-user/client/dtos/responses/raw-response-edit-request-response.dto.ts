import { edit_requests, user } from '@prisma/client';

export class RawResponseEditRequestDto {
  data: edit_requests & {
    user: user;
    reviewer: user | null;
  };
}
