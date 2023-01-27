import { edit_requests, user } from '@prisma/client';

export class RawCreateEditRequestResponse {
  data: edit_requests & {
    user: user;
  };
}
