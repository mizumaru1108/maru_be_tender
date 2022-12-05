import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { RegisterTenderDto } from '../../../tender-auth/dtos/requests/register-tender.dto';

export function CreateClientMapper(userId: string, request: RegisterTenderDto) {
  const userCreatePayload: Prisma.userCreateInput = {
    id: userId,
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

  return userCreatePayload;
}
