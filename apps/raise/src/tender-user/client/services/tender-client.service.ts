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
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderClientService {
  constructor(
    private readonly prismaService: PrismaService,
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
    // base user information
    const userCreatePayload: Prisma.userCreateInput = {
      id: idFromFusionAuth,
      employee_name: request.data.employee_name,
      email: request.data.email,
      mobile_number: request.data.entity_mobile,
      status: {
        connect: {
          id: 'WAITING_FOR_ACTIVATION',
        },
      },
      roles: {
        create: {
          user_type: {
            connect: {
              id: 'CLIENT',
            },
          },
        },
      },
    };

    // path of the user
    if (request.data.employee_path) {
      userCreatePayload.employee_track = {
        connect: {
          id: request.data.employee_path,
        },
      };
    }

    // client data
    userCreatePayload.client_data = {
      create: {
        id: nanoid(),
        license_number: request.data.license_number,
        authority: request.data.authority,
        board_ofdec_file: {
          url: request.data.board_ofdec_file.url,
          type: request.data.board_ofdec_file.type,
          size: request.data.board_ofdec_file.size,
        },
        center_administration: request.data.center_administration || null,
        ceo_mobile: request.data.ceo_mobile,
        data_entry_mail: request.data.data_entry_mail,
        data_entry_name: request.data.data_entry_name,
        data_entry_mobile: request.data.data_entry_mobile,
        ceo_name: request.data.ceo_name,
        entity_mobile: request.data.entity_mobile,
        governorate: request.data.governorate,
        region: request.data.region,
        headquarters: request.data.headquarters,
        entity: request.data.entity,
        license_file: {
          url: request.data.license_file.url,
          type: request.data.license_file.type,
          size: request.data.license_file.size,
        },
        date_of_esthablistmen: request.data.date_of_esthablistmen,
        license_expired: request.data.license_expired,
        license_issue_date: request.data.license_issue_date,
        num_of_beneficiaries: request.data.num_of_beneficiaries,
        website: request.data.website,
        twitter_acount: request.data.twitter_acount,
        num_of_employed_facility: request.data.num_of_employed_facility,
        phone: request.data.phone,
        client_field: request.data.client_field,
      },
    };

    // bank informations
    if (request.data.bank_informations.length > 0) {
      userCreatePayload.bank_information = {
        createMany: {
          data: request.data.bank_informations.map((bank) => ({
            bank_name: bank.bank_name || null,
            bank_account_number: bank.bank_account_number || null,
            bank_account_name: bank.bank_account_name || null,
            card_image: {
              url: bank.card_image.url,
              type: bank.card_image.type,
              size: bank.card_image.size,
            },
          })),
        },
      };
    }

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

    let newEditRequest: Prisma.edit_requestCreateInput[] | [] = [];

    if (clientData.user.status_id !== 'ACTIVE_ACCOUNT') {
      throw new BadRequestException(
        'User have to be ACTIVE to perform an edit request!',
      );
    }

    // for refactor later on maybe(?) :D
    // let denactiveAccount: boolean = false; // for conditional deactivation
    // for (const [key, value] of Object.entries(newValues)) {
    //   // TODO: do logic to denactive account when some spesific field is changed
    //   // example: when email is changed / when phone number is changed, denactive the account
    //   // denactiveAccount = key === 'email' || key === 'phone_number';
    //   if (key in oldValues && value !== oldValues[key]) {
    //     const editRequest: edit_request = {
    //       id: nanoid(),
    //       field_name: key,
    //       old_value: oldValues[key].toString(),
    //       new_value: value.toString(),
    //       field_type: typeof oldValues[key],
    //       ...baseEditRequest,
    //     };
    //     newEditRequest.push(editRequest);
    //     requestChangeCount++;
    //     message = message + `${key} change requested`;
    //   }
    // }

    if (editRequest.newValues) {
      const mapResult = CreateEditRequestMapper(
        user.id,
        clientData,
        editRequest,
      );
      logs = `your account will be deactivate until account manager responded, ${mapResult.editRequest.length} field has been asked for chages, details: ${mapResult.logs}`;
      newEditRequest = mapResult.editRequest;

      await this.tenderClientRepository.createUpdateRequest(
        user.id,
        newEditRequest,
        true,
      );
    }

    if (newEditRequest.length === 0) logs = 'No changes requested';

    const response: ClientEditRequestResponseDto = {
      logs: logs,
      createdEditRequest: newEditRequest,
    };

    return response;
  }

  valueParser(type: string, newValue: string) {
    if (type === 'number') return Number(newValue);
    if (type === 'object') return JSON.parse(newValue);
    if (type === 'date') return new Date(newValue);
    return newValue;
  }

  // single accept
  async acceptEditRequest(reviewerId: string, request: ApproveEditRequestDto) {
    // check if the request is exist and not approved yet
    const editRequest = await this.tenderClientRepository.findUpdateRequestById(
      request.requestId,
    );
    if (!editRequest) throw new NotFoundException('Edit request not found!');

    // check if the request is already approved
    if (editRequest.approval_status === 'APPROVED') {
      throw new BadRequestException('Edit request already approved!');
    }

    // check the field type
    const {
      field_type: fieldType,
      new_value: newValue,
      field_name: fieldName,
    } = editRequest;

    // parse the new value to the correct type based on the field type
    const parsedValue = this.valueParser(fieldType, newValue);

    // approve the request, and change the field
    console.log('field name', fieldName);
    if (
      ['password', 'email', 'entity_mobile', 'bank_information'].indexOf(
        fieldName,
      ) === -1
    ) {
      console.log('on if');
      await this.tenderClientRepository.appoveUpdateRequest(
        editRequest,
        reviewerId,
        parsedValue,
      );
    } else {
      console.log('on else');
      // TODO: if it password, email, phone number / bank apply custom logic.
    }

    // count the remaining request
    const remainingProposal =
      await this.tenderClientRepository.getRemainingUpdateRequestCount(
        editRequest.user_id,
      );
    console.log('remainingProposal', remainingProposal);

    if (remainingProposal === 0) {
      await this.tenderUserRepository.changeUserStatus(
        editRequest.user_id,
        'ACTIVE_ACCOUNT',
      );
    }
  }

  // batch accept
  async acceptEditRequests(
    reviewerId: string,
    request: BatchApproveEditRequestDto,
  ) {}
}
