import {
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

@Injectable()
export class TenderClientService {
  constructor(
    private readonly prismaService: PrismaService,
    private tenderUserRepository: TenderUserRepository,
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
  ): Promise<user> {
    // base user information
    const userCreatePayload: Prisma.userCreateInput = {
      id: idFromFusionAuth,
      employee_name: request.data.employee_name,
      email: request.data.email,
      mobile_number: request.data.phone,
      user_role: ['CLIENT'],
      user_status: {
        connect: {
          id: request.data.status ?? 'WAITING_FOR_ACTIVATION',
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
        center_administration: request.data.center_administration,
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
        vat: request.data.vat,
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
    return createdUser;
  }

  async createEditRequest(
    user: ICurrentUser,
    editRequest: ClientEditRequestDto,
  ): Promise<ClientEditRequestResponseDto> {
    const clientData = await this.prismaService.client_data.findUnique({
      where: {
        user_id: user.id,
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
      // await this.prismaService.client_data.update({
      //   where: {
      //     user_id: user.id,
      //   },
      //   data: {
      //     status: 'WAITING_FOR_EDITING_APPROVAL',
      //   },
      // });
    }

    const response: ClientEditRequestResponseDto = {
      detail: message,
      createdEditRequest: newEditRequest,
    };

    return response;
  }
}
