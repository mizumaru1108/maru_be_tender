import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { MessageType } from '../types';

export interface IIncomingMessageSummary {
  senderId: string;
  senderRoles: string[];
  senderRolesAs: string;
  senderEmployeeName: string | null;
  receiverId: string;
  receiverRoles: string[];
  receiverRolesAs: string;
  receiverEmployeeName: string | null;
  roomChatId: string;
  correspondanceType: string;
  meesageType: MessageType;
  content: string | null;
  attachment: UploadFilesJsonbDto | null;
}
