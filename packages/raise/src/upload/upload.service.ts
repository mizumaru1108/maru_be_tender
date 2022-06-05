import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getHello() {
    return { hello: 'world' };
  }
}