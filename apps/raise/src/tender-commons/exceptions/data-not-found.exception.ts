export class DataNotFoundException extends Error {
  constructor(detail?: string) {
    super(`Data not found!${detail ? `, more detail: ${detail}` : ''}`);
  }
}
