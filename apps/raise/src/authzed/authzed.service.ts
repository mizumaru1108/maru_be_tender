import { Injectable } from '@nestjs/common';
import { v1 } from '@authzed/authzed-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthzedService {
  private client;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('AUTHZED_TOKEN') || '';
    this.client = v1.NewClient(token);
  }

  async createResourceReference(objectType: string, objectId: string) {
    return await v1.ObjectReference.create({
      objectType,
      objectId,
    });
  }

  async createSubjectReference(object: any) {
    return await v1.SubjectReference.create({
      object,
    });
  }

  async checkPermission(resource: any, subject: any, permission: string) {
    const checkPermissionRequest = await v1.CheckPermissionRequest.create({
      resource,
      subject,
      permission,
    });

    let result = false;

    try {
      const callback = (err: any, response: any) => {
        if (err) console.log('Error\n', err);
        if (response) result = true;
      };
      this.client.checkPermission(checkPermissionRequest, callback);
    } catch (error) {
      result = false;
      console.log('WHATTT', error);
    }
    return result;
  }
}
