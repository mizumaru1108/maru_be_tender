import { Injectable } from '@nestjs/common';

@Injectable()
export class HrService {
  async getListAll() {
    return 'this should be returning hr list';
  }
}
