class AttachmentFile {
  filename: string;
  path: string;
}

export class MessageDto {
  organizationId: string;
  name: string;
  email: string;
  help_message: string;
  files: Array<AttachmentFile>;
}
