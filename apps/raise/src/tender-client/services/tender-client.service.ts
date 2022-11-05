import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../prisma/prisma.service';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ClientEditRequestDto } from '../dtos/requests/client-edit-request.dto';

import { edit_request, Prisma } from '@prisma/client';
import { ClientEditRequestResponseDto } from '../dtos/responses/client-edit-request.response.dto';
import { compareUrl } from '../../tender/commons/utils/compare-jsonb-imageurl';

@Injectable()
export class TenderClientService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserTrack(userId: string): Promise<string> {
    const track = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        employee_path: true,
      },
    });
    if (!track) throw new NotFoundException('User not found');
    if (!track.employee_path) {
      throw new NotFoundException(
        "Current user doesn't have any track specified!",
      );
    }
    return track.employee_path;
  }

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
      // console.log(newEditRequest);
    } else {
      message = 'No changes requested';
    }

    if (editRequest.bank_information) {
      // TODO: loop the request, find by id if exist then update, if not exist then create with
      // if exist then update, if not exist then create.
      try {
        await Promise.all(
          editRequest.bank_information.map(async (bankInfo) => {
            const bankInfoData =
              await this.prismaService.bank_information.findUnique({
                where: {
                  id: bankInfo.id,
                },
              });

            //if it's found then update
            if (bankInfoData) {
              const updateBankInfo: Prisma.bank_informationUpdateInput = {};

              let isSame = true;
              if (bankInfo.card_image) {
                const sameUrl = await compareUrl(
                  bankInfoData, // old object value
                  bankInfo.card_image, // new object from request
                );
                if (!sameUrl) isSame = false;
              }

              // changes to new one if it's not the same
              if (!isSame) {
                updateBankInfo.card_image = {
                  url: bankInfo.card_image.url,
                  type: bankInfo.card_image.type,
                  size: bankInfo.card_image.size,
                };
              }
              compareUrl(bankInfoData, bankInfo.card_image);

              bankInfo.bank_name &&
                (updateBankInfo.bank_name = bankInfo.bank_name);
              bankInfo.bank_account_name &&
                (updateBankInfo.bank_name = bankInfo.bank_name);
              bankInfo.bank_account_number &&
                (updateBankInfo.bank_name = bankInfo.bank_name);

              // update
              return this.prismaService.bank_information.update({
                where: {
                  id: bankInfo.id,
                },
                data: {
                  ...updateBankInfo,
                },
              });
            } else {
              // if it doesn't exist then create
              return this.prismaService.bank_information.create({
                data: {
                  id: bankInfo.id,
                  user_id: user.id,
                  bank_name: bankInfo.bank_name,
                  bank_account_name: bankInfo.bank_account_name,
                  bank_account_number: bankInfo.bank_account_number,
                  card_image: {
                    ...bankInfo.card_image,
                  },
                },
              });
            }
          }),
        );
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'Failed to create bank information',
        );
      }
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
