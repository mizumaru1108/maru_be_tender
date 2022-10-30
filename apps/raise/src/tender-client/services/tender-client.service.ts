import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../prisma/prisma.service';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ClientEditRequestDto } from '../dtos/requests/client-edit-request.dto';

import { edit_request } from '@prisma/client';
import { ClientEditRequestResponseDto } from '../dtos/responses/client-edit-request.response.dto';

@Injectable()
export class TenderClientService {
  constructor(private readonly prismaService: PrismaService) {}

  async createEditRequest(
    user: ICurrentUser,
    editRequest: ClientEditRequestDto,
  ): Promise<ClientEditRequestResponseDto> {
    const clientData = await this.prismaService.client_data.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!clientData) {
      throw new NotFoundException('Client data not found!');
    }

    const baseEditRequest = {
      approval_status: 'WAITING_FOR_APPROVAL',
      user_id: user.id,
    };

    let message = 'Edit Request success';
    let requestChangeCount = 0;

    const newEditRequest: edit_request[] = [];
    let denactiveAccount: boolean = false;

    if (editRequest.newValues) {
      const newValues = editRequest.newValues as Record<string, any>;
      const oldValues = clientData as Record<string, any>;

      // if newValue has at least one key

      for (const [key, value] of Object.entries(newValues)) {
        // TODO: do logic to denactive account when some spesific field is changed
        // example: when email is changed / when phone number is changed, denactive the account
        // denactiveAccount = key === 'email' || key === 'phone_number';
        if (key in oldValues && value !== oldValues[key]) {
          const editRequest: edit_request = {
            id: nanoid(),
            field_name: key,
            old_value: oldValues[key].toString(),
            new_value: value.toString(),
            ...baseEditRequest,
          };
          newEditRequest.push(editRequest);
          requestChangeCount++;
          message = message + `${key} change requested`;
        }
      }
    }

    if (newEditRequest.length > 0) {
      try {
        await this.prismaService.edit_request.createMany({
          data: newEditRequest,
        });
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Failed to create edit request');
      }
      console.log(newEditRequest);
    } else {
      message = 'No changes requested';
    }

    denactiveAccount = requestChangeCount > 0;
    if (denactiveAccount) {
      await this.prismaService.client_data.update({
        where: {
          email: user.email,
        },
        data: {
          status: 'WAITING_FOR_EDITING_APPROVAL',
        },
      });
    }

    const response: ClientEditRequestResponseDto = {
      detail: message,
      createdEditRequest: newEditRequest,
    };

    return response;
  }
}
