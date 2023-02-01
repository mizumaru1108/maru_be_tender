import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';

export type ApprovalStatus = 'WAITING_FOR_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface finalUploadFileJson extends UploadFilesJsonbDto {
  color?: string;
}
