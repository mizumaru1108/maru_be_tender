import { message, user } from '@prisma/client';

export interface MessageGroup {
  created_at: string;
  messages: (message & {
    sender: user | null;
    receiver: user | null;
  })[];
}
