import { message } from "@prisma/client";

export interface MessageGroup {
  created_at: string;
  messages: message[];
}
