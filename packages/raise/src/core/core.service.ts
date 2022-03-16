import { Injectable } from '@nestjs/common';

export interface ResponseWrapper {
  success: boolean;
  status: number;
  message: string;
}

@Injectable()
export class CoreService {
  getHello(): ResponseWrapper {
    return { success: true, status: 200, message: 'Hello World!' };
  }
}
