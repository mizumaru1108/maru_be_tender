import { Prisma } from '@prisma/client';
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

  // // bank informations
  // if (request.data.bank_informations.length > 0) {
  //   userCreatePayload.bank_information = {
  //     createMany: {
  //       data: request.data.bank_informations.map((bank) => ({
  //         bank_name: bank.bank_name || null,
  //         bank_account_number: bank.bank_account_number || null,
  //         bank_account_name: bank.bank_account_name || null,
  //         card_image: {
  //           url: bank.card_image.url,
  //           type: bank.card_image.type,
  //           size: bank.card_image.size,
  //         },
  //       })),
  //     },
  //   };
  // }

  return userCreatePayload;
}
