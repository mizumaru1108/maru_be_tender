import { Injectable } from '@nestjs/common';
import { v1 } from '@authzed/authzed-node';
import { ConfigService } from '@nestjs/config';
import {
  CheckPermissionResponse,
  ObjectReference,
  RelationshipUpdate,
  SubjectReference,
} from '@authzed/authzed-node/dist/src/v1';
import { AuthzedRelationship } from './enums/relationship.enum';

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
   * Create Relationship Between Resource and Subject
   * @param refrenceId organizationId
   * @param subjectId userId
   * @param relationship relationship to create (manager/operator/vendor)
   * @returns {Promise<v1.Relationship>} Relationship created
   */
  async createRelationship(
    refrenceId: string,
    subjectId: string,
    relationship: AuthzedRelationship,
  ): Promise<v1.Relationship> {
    const refrence: ObjectReference = {
      objectType: 'tmra_staging/organization',
      objectId: `${refrenceId}`,
    };

    const subject: SubjectReference = {
      object: {
        objectType: 'tmra_staging/user',
        objectId: `${subjectId}`,
      },
      optionalRelation: '',
    };

    const relationshipUpdate: RelationshipUpdate[] = [
      {
        operation: 2, // touch, as it says on library TOUCH will upsert the relationship, and will not error if it already exists.
        relationship: {
          resource: refrence,
          subject: subject,
          relation: relationship as string,
        },
      },
    ];

    const relationshipRequest: v1.WriteRelationshipsRequest = {
      optionalPreconditions: [],
      updates: relationshipUpdate,
    };

    // apply line above with async await / promise (reject and resolve)
    const result = new Promise<v1.Relationship>((resolve, reject) => {
      this.client.writeRelationships(
        relationshipRequest,
        (err: any, response: any) => {
          if (err) reject(err);
          resolve(response);
        },
      );
    });
    return result;
  }

  /**
   * Checking permissions
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
