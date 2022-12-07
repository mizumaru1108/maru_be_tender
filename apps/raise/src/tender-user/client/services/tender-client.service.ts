import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../../prisma/prisma.service';
import { ICurrentUser } from '../../../user/interfaces/current-user.interface';
import { ClientEditRequestDto } from '../dtos/requests/client-edit-request.dto';

import { edit_request, Prisma, user } from '@prisma/client';
import { RegisterTenderDto } from '../../../tender-auth/dtos/requests/register-tender.dto';
import { ClientEditRequestResponseDto } from '../dtos/responses/client-edit-request.response.dto';
import { compareUrl } from '../../../tender-commons/utils/compare-jsonb-imageurl';
import { TenderUserRepository } from '../../user/repositories/tender-user.repository';
import { CreateUserResponseDto } from '../../user/dtos/responses/create-user-response.dto';
import { TenderClientRepository } from '../repositories/tender-client.repository';
import { CreateEditRequestMapper } from '../mappers/edit_request.mapper';
import {
  ApproveEditRequestDto,
  BatchApproveEditRequestDto,
} from '../dtos/requests/approve-edit-request.dto';
import { CreateClientMapper } from '../mappers/create-client.mapper';
import { addLog } from '../utils/add-logs';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { UpdateBankInfoPayload } from '../interfaces/update-bank-info-payload.interface';
import { UpdateUserPayload } from '../../user/interfaces/update-user-payload.interface';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';

@Injectable()
export class TenderClientService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderClientService.name,
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
    private tenderUserRepository: TenderUserRepository,
    private tenderClientRepository: TenderClientRepository,
  ) {}

  async getUserTrack(userId: string): Promise<string | null> {
    try {
      const track = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          employee_path: true,
        },
      });
      return track?.employee_path || null;
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(error);
    }
  }

  // create user and it's relation to client_data table by user_id in client_data table
  async createUserAndClient(
    idFromFusionAuth: string,
    request: RegisterTenderDto,
  ): Promise<CreateUserResponseDto> {
    const userCreatePayload = CreateClientMapper(idFromFusionAuth, request);

    const createdUser = await this.tenderUserRepository.createUser(
      userCreatePayload,
    );

    return {
      createdUser: createdUser instanceof Array ? createdUser[0] : createdUser,
    };
  }

  async createEditRequest(
    user: ICurrentUser,
    editRequest: ClientEditRequestDto,
  ): Promise<ClientEditRequestResponseDto> {
    const clientData = await this.tenderClientRepository.findClientAndUser(
      user.id,
    );
    if (!clientData) throw new NotFoundException('Client data not found!');

    let logs = 'Edit Request success';

    let newEditRequest: Prisma.edit_requestCreateInput[] = [];

    const baseEditRequest = {
      approval_status: 'WAITING_FOR_APPROVAL',
      user_id: user.id,
    };

    // if (clientData.user.status_id !== 'ACTIVE_ACCOUNT') {
    //   throw new BadRequestException(
    //     'User have to be ACTIVE to perform an edit request!',
    //   );
    // }

    if (editRequest.newValues) {
      const mapResult = CreateEditRequestMapper(
        user.id,
        clientData,
        editRequest,
        logs,
        baseEditRequest,
      );
      newEditRequest = mapResult.editRequest;
    }

    if (editRequest.bank_information) {
      const mapBankInfo = editRequest.bank_information.map(async (bankInfo) => {
        const bankInfoData =
          await this.prismaService.bank_information.findUnique({
            where: {
              id: bankInfo.id,
            },
          });

        //if it's found then add it to edit request
        if (bankInfoData) {
          if (bankInfo.card_image) {
            const sameUrl = await compareUrl(
              bankInfoData, // old object value
              bankInfo.card_image, // new object from request
            );

            if (!sameUrl) {
              newEditRequest.push({
                id: nanoid(),
                field_name: `bankInfo.${bankInfo.id}.card_image`,
                old_value: JSON.stringify(bankInfoData.card_image),
                new_value: JSON.stringify(bankInfo.card_image),
                field_type: 'object',
                ...baseEditRequest,
              });
              addLog(`bankInfo.${bankInfo.id}.card_image`, logs);
            }
          }

          if (
            bankInfo.bank_name &&
            bankInfo.bank_name !== bankInfoData.bank_name
          ) {
            newEditRequest.push({
              id: nanoid(),
              field_name: `bankInfo.${bankInfo.id}.bank_name`,
              old_value: bankInfoData.bank_name,
              new_value: bankInfo.bank_name,
              field_type: 'string',
              ...baseEditRequest,
            });
            addLog(`bankInfo.${bankInfo.id}.bank_name`, logs);
          }

          if (
            bankInfo.bank_account_name &&
            bankInfo.bank_account_name !== bankInfoData.bank_account_name
          ) {
            newEditRequest.push({
              id: nanoid(),
              field_name: `bankInfo.${bankInfo.id}.bank_account_name`,
              old_value: bankInfoData.bank_account_name,
              new_value: bankInfo.bank_account_name,
              field_type: 'string',
              ...baseEditRequest,
            });
            addLog(`bankInfo.${bankInfo.id}.bank_account_name`, logs);
          }

          if (
            bankInfo.bank_account_number &&
            bankInfo.bank_account_number !== bankInfoData.bank_account_number
          ) {
            newEditRequest.push({
              id: nanoid(),
              field_name: `bankInfo.${bankInfo.id}.bank_account_number`,
              old_value: bankInfoData.bank_account_number,
              new_value: bankInfo.bank_account_number,
              field_type: 'string',
              ...baseEditRequest,
            });
            addLog(`bankInfo.${bankInfo.id}.bank_account_number`, logs);
          }
        } else {
          // if it doesn't exist then create
          newEditRequest.push({
            id: nanoid(),
            field_name: 'newBankInfo',
            old_value: null,
            new_value: JSON.stringify(bankInfo),
            field_type: 'object',
            ...baseEditRequest,
          });
        }
      });

      await Promise.all(mapBankInfo);
    }

    console.log('the edit request', newEditRequest);
    logs = `your account will be deactivate until account manager responded, ${newEditRequest.length} field has been asked for chages, details: ${logs}`;

    await this.tenderClientRepository.createUpdateRequest(
      user.id,
      newEditRequest,
      true,
    );

    if (newEditRequest.length === 0) logs = 'No changes requested';

    const response: ClientEditRequestResponseDto = {
      logs: logs,
    };

    return response;
  }

  valueParser(type: string, newValue: string) {
    if (type === 'number') return Number(newValue);
    if (type === 'object') return JSON.parse(newValue);
    if (type === 'date') return new Date(newValue);
    return newValue;
  }

  // single accept for edit request
  // async acceptEditRequest(reviewerId: string, request: ApproveEditRequestDto) {
  //   // check if the request is exist and not approved yet
  //   const editRequest = await this.tenderClientRepository.findUpdateRequestById(
  //     request.requestId,
  //   );
  //   if (!editRequest) throw new NotFoundException('Edit request not found!');

  //   // check if the request is already approved / rejected
  //   if (editRequest.approval_status === 'APPROVED') {
  //     throw new BadRequestException('Edit request already approved!');
  //   }
  //   if (editRequest.approval_status === 'REJECTED') {
  //     throw new BadRequestException('Edit request already rejected!');
  //   }

  //   let logs: string = '';
  //   let itemsLeft: string[] = [];

  //   // check the field type
  //   const {
  //     field_type: fieldType,
  //     new_value: newValue,
  //     field_name: fieldName,
  //   } = editRequest;

  //   // parse the new value to the correct type based on the field type
  //   const parsedValue = this.valueParser(fieldType, newValue);

  //   // approve the request, and change the field value
  //   if (
  //     [
  //       'password',
  //       'email',
  //       'entity_mobile',
  //       'employee_name',
  //       'bank_information',
  //     ].indexOf(fieldName) === -1
  //   ) {
  //     await this.tenderClientRepository.appoveUpdateRequest(
  //       editRequest,
  //       reviewerId,
  //       parsedValue,
  //     );
  //   } else {
  //     console.log('on else');
  //     // TODO: if it password, email, phone number / bank apply custom logic.
  //   }

  //   // count the remaining request
  //   const remainingRequest =
  //     await this.tenderClientRepository.getRemainingUpdateRequestCount(
  //       editRequest.user_id,
  //     );

  //   if (remainingRequest.length === 0) {
  //     await this.tenderUserRepository.changeUserStatus(
  //       editRequest.user_id,
  //       'ACTIVE_ACCOUNT',
  //     );
  //     logs = 'All edit request has been approved, your account is active now!';
  //   }

  //   if (remainingRequest.length > 0) {
  //     itemsLeft = remainingRequest.map((item: edit_request) => {
  //       return ` [${item.field_name}]`;
  //     });

  //     logs = `Edit request has been approved, you have ${remainingRequest.length} request(s) remaining,  your account is still inactive!`;
  //   }

  //   return {
  //     logs,
  //     itemsLeft,
  //   };
  // }

  // batch accept for edit request
  async acceptEditRequests(
    reviewerId: string,
    request: BatchApproveEditRequestDto,
  ) {
    // check if the request is exist and not approved yet
    const editRequests =
      await this.tenderClientRepository.findUnapprovedEditRequestByUserId(
        request.userId,
      );

    const updateClientPayload: Record<string, any> = {};
    const updateUserPayload: Record<string, any> = {};
    let createBankInfoPayload: Prisma.bank_informationCreateInput[] = [];
    const updateBankInfoPayload: UpdateBankInfoPayload[] = [];
    const fusionAuthChangeUserPayload: UpdateUserPayload = {};

    if (editRequests.length > 0) {
      editRequests.forEach((editRequest) => {
        const parsedValue = this.valueParser(
          editRequest.field_type,
          editRequest.new_value,
        );

        // change email and mobile will be implemented later on
        // if (
        //   ['employee_name', 'email', 'entity_mobile'].indexOf(
        //     editRequest.field_name,
        //   ) > -1
        // ) {
        if (['employee_name'].indexOf(editRequest.field_name) > -1) {
          updateUserPayload[editRequest.field_name] = parsedValue;
          // will be user later on after email and mobile number can be edited.
          // if (editRequest.field_name === 'email') {
          //   fusionAuthChangeUserPayload.email = parsedValue;
          // }
          // if (editRequest.field_name === 'entity_mobile') {
          //   fusionAuthChangeUserPayload.mobile_number = parsedValue;
          // }
          if (editRequest.field_name === 'employee_name') {
            fusionAuthChangeUserPayload.employee_name = parsedValue;
          }
        } else if (editRequest.field_name.split('.')[0] === 'bankInfo') {
          const bankInfoId = editRequest.field_name.split('.')[1];
          const bankInfoField = editRequest.field_name.split('.')[2];

          if (updateBankInfoPayload.length > 0) {
            updateBankInfoPayload.forEach((item) => {
              // if item._id === bankinfoId then add the field to the data, else create new item
              if (item._id === bankInfoId) {
                item.data[bankInfoField] = parsedValue;
              } else {
                updateBankInfoPayload.push({
                  _id: bankInfoId,
                  data: {
                    [bankInfoField]: parsedValue,
                  },
                });
              }
            });
          } else {
            updateBankInfoPayload.push({
              _id: bankInfoId,
              data: {
                [bankInfoField]: parsedValue,
              },
            });
          }
        } else if (editRequest.field_name === 'newBankInfo') {
          // push to current array
          createBankInfoPayload = [
            ...(createBankInfoPayload || []),
            parsedValue as Prisma.bank_informationCreateInput,
          ];
        } else if (editRequest.field_name === 'password') {
          fusionAuthChangeUserPayload.password = parsedValue;
        } else {
          updateClientPayload[editRequest.field_name] = parsedValue;
        }
      });
    }

    this.logger.log('info', 'client update payload', updateClientPayload);
    this.logger.log('info', 'user update payload', updateUserPayload);
    this.logger.log('info', 'bank info update payload', updateBankInfoPayload);
    this.logger.log(
      'info',
      'create many bank info payload',
      createBankInfoPayload,
    );
    this.logger.log(
      'info',
      'user new password',
      fusionAuthChangeUserPayload.password,
    );

    // const response =
    await this.tenderClientRepository.approveEditRequests(
      request.userId,
      reviewerId,
      updateClientPayload,
      updateUserPayload,
      createBankInfoPayload,
      updateBankInfoPayload,
    );
    // console.log('response', response);

    if (Object.keys(fusionAuthChangeUserPayload).length > 0) {
      this.logger.log(
        'info',
        'changing user info on fusion auth with: ',
        fusionAuthChangeUserPayload,
      );

      const fusionAuthResponse =
        await this.fusionAuthService.fusionAuthUpdateUser(
          request.userId,
          fusionAuthChangeUserPayload,
        );

      this.logger.log(
        'info',
        'FusionAuth Changing is',
        fusionAuthResponse ? 'success' : 'failed',
      );
    }
  }
}
