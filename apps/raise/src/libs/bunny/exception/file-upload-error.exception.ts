export class FileUploadErrorException extends Error {
  constructor(detail?: string) {
    super(`File Upload Error!${detail ? `, more detail: ${detail}` : ''}`);
  }
}
