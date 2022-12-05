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

    let newEditRequest: Prisma.edit_requestCreateInput[] | [] = [];

    if (clientData.user.status_id !== 'ACTIVE_ACCOUNT') {
      throw new BadRequestException(
        'User have to be ACTIVE to perform an edit request!',
      );
    }

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
  async acceptEditRequest(reviewerId: string, request: ApproveEditRequestDto) {
    // check if the request is exist and not approved yet
    const editRequest = await this.tenderClientRepository.findUpdateRequestById(
      request.requestId,
    );
    if (!editRequest) throw new NotFoundException('Edit request not found!');

    // check if the request is already approved / rejected
    if (editRequest.approval_status === 'APPROVED') {
      throw new BadRequestException('Edit request already approved!');
    }
    if (editRequest.approval_status === 'REJECTED') {
      throw new BadRequestException('Edit request already rejected!');
    }

    let logs: string = '';
    let itemsLeft: string[] = [];

    // check the field type
    const {
      field_type: fieldType,
      new_value: newValue,
      field_name: fieldName,
    } = editRequest;

    // parse the new value to the correct type based on the field type
    const parsedValue = this.valueParser(fieldType, newValue);

    // approve the request, and change the field value
    if (
      [
        'password',
        'email',
        'entity_mobile',
        'employee_name',
        'bank_information',
      ].indexOf(fieldName) === -1
    ) {
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

    if (remainingProposal.length === 0) {
      await this.tenderUserRepository.changeUserStatus(
        editRequest.user_id,
        'ACTIVE_ACCOUNT',
      );
      logs = 'All edit request has been approved, your account is active now!';
    }

    if (remainingProposal.length > 0) {
      itemsLeft = remainingProposal.map((item: edit_request) => {
        return ` [${item.field_name}]`;
      });

      logs = `Edit request has been approved, you have ${remainingProposal.length} request(s) remaining,  your account is still inactive!`;
    }

    return {
      logs,
      itemsLeft,
    };
  }

  // batch accept for edit request
  async acceptEditRequests(
    reviewerId: string,
    request: BatchApproveEditRequestDto,
  ) {
    // check if the request is exist and not approved yet
    const editRequest = await this.tenderClientRepository.findUpdateRequestById(
      request.userId,
    );
    if (!editRequest) throw new NotFoundException('Edit request not found!');

    // check if the request is already approved / rejected
    if (editRequest.approval_status === 'APPROVED') {
      throw new BadRequestException('Edit request already approved!');
    }
    if (editRequest.approval_status === 'REJECTED') {
      throw new BadRequestException('Edit request already rejected!');
    }

    let logs: string = '';
    let itemsLeft: string[] = [];

    // check the field type
    const {
      field_type: fieldType,
      new_value: newValue,
      field_name: fieldName,
    } = editRequest;

    // parse the new value to the correct type based on the field type
    const parsedValue = this.valueParser(fieldType, newValue);

    // approve the request, and change the field value
    if (
      [
        'password',
        'email',
        'entity_mobile',
        'employee_name',
        'bank_information',
      ].indexOf(fieldName) === -1
    ) {
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

    if (remainingProposal.length === 0) {
      await this.tenderUserRepository.changeUserStatus(
        editRequest.user_id,
        'ACTIVE_ACCOUNT',
      );
      logs = 'All edit request has been approved, your account is active now!';
    }

    if (remainingProposal.length > 0) {
      itemsLeft = remainingProposal.map((item: edit_request) => {
        return ` [${item.field_name}]`;
      });

      logs = `Edit request has been approved, you have ${remainingProposal.length} request(s) remaining,  your account is still inactive!`;
    }

    return {
      logs,
      itemsLeft,
    };
  }
}
