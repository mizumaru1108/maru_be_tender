import { client_data, user, user_role } from '@prisma/client';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { TenderCurrentUser } from '../interfaces/current-user.interface';
import { UpdateUserPayload } from '../interfaces/update-user-payload.interface';

export const updateUserMapper = (
  existingData: user & {
    client_data: client_data | null;
    roles: user_role[];
  },
  request: UpdateUserDto,
  currentUser: TenderCurrentUser,
) => {
  const updateUserPayload: UpdateUserPayload = {};

  if (
    request.employee_name &&
    request.employee_name !== existingData.employee_name
  ) {
    updateUserPayload.employee_name = request.employee_name;
  }

  if (request.email && request.email !== existingData.email) {
    updateUserPayload.email = request.email;
  }

  if (request.address && request.address !== existingData.address) {
    updateUserPayload.address = request.address;
  }

  if (currentUser.choosenRole !== 'tender_client') {
    if (
      request.mobile_number &&
      request.mobile_number !== existingData.mobile_number
    ) {
      updateUserPayload.mobile_number = request.mobile_number;
    }
  } else {
    if (
      request.mobile_number &&
      existingData.client_data?.entity_mobile &&
      request.mobile_number !== existingData.client_data.entity_mobile
    ) {
      updateUserPayload.mobile_number = request.mobile_number;
      updateUserPayload.client_data = {
        update: {
          entity_mobile: {
            set: request.mobile_number,
          },
        },
      };
    }
  }

  if (request.new_password) updateUserPayload.password = request.new_password;

  return updateUserPayload;
};
