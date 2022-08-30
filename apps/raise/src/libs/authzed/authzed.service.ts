import { Injectable } from '@nestjs/common';
import { v1 } from '@authzed/authzed-node';
import { ConfigService } from '@nestjs/config';
import {
  CheckPermissionResponse,
  ObjectReference,
  SubjectReference,
} from '@authzed/authzed-node/dist/src/v1';

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
    const checkPermissionRequest = v1.CheckPermissionRequest.create({
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

  /**
   * Checking permission
   * @param resource in this case organization
   * @param subject in this case userId
   * @param permission permission to check
   * @returns Promise<CheckPermissionResponse> 0(UNSPECIFIED), 1(NOPERMISSION), 2(HASPERMISSION)
   */
  async checkPermissions(
    resource: ObjectReference,
    subject: SubjectReference,
    permission: string,
  ): Promise<CheckPermissionResponse> {
    // ObjectReference Example
    // const refrence: ObjectReference = {
    //   objectType: 'tmra_staging/organization',
    //   objectId: '61b4794cfe52d41f557f1acc',
    // };

    // SubjectReference Example
    // const subject: SubjectReference = {
    //   object: {
    //     objectType: 'tmra_staging/user',
    //     objectId: '213efb96-d2ae-4124-9dc8-79f33227b434',
    //   },
    //   optionalRelation: '',
    // };

    const checkPermissionRequest = v1.CheckPermissionRequest.create({
      resource,
      subject,
      permission,
    });

    // response UNSPECIFIED = 0, NO_PERMISSION = 1, HAS_PERMISSION = 2
    const result = new Promise<CheckPermissionResponse>((resolve, reject) => {
      this.client.checkPermission(
        checkPermissionRequest,
        (err: any, response: any) => {
          if (err) {
            console.log('Error\n', err);
            reject(err);
          }
          if (response) {
            // console.log('Response\n', response);
            const res: CheckPermissionResponse = {
              permissionship: response.permissionship,
              checkedAt: response.checkedAt,
            };
            resolve(res);
          }
        },
      );
    });
    return result;
  }
}
