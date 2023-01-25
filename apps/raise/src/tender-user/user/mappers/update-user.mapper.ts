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
  let updateUserPayload: UpdateUserPayload = {};

  console.log({ existingData });
  console.log({ request });
  console.log({ currentUser });

  console.log(request.mobile_number);
  console.log(existingData.client_data?.entity_mobile);
  console.log(
    existingData.client_data?.entity_mobile === request.mobile_number,
  );
  console.log(existingData.mobile_number);
  console.log(existingData.mobile_number === request.mobile_number);
  if (
    request.employee_name &&
    request.employee_name !== existingData.employee_name
  ) {
    console.log('employee name berubah');
    updateUserPayload.employee_name = request.employee_name;
  }

  if (request.email && request.email !== existingData.email) {
    console.log('email berubah');
    updateUserPayload.email = request.email;
  }

  if (request.address && request.address !== existingData.address) {
    console.log('address berubah');
    updateUserPayload.address = request.address;
  }

  if (currentUser.choosenRole !== 'tender_client') {
    if (
      request.mobile_number &&
      request.mobile_number !== existingData.mobile_number
    ) {
      console.log('mobile');
      updateUserPayload.mobile_number = request.mobile_number;
    }
  } else {
    if (
      request.mobile_number &&
      existingData.client_data?.entity_mobile &&
      request.mobile_number !== existingData.client_data.entity_mobile
    ) {
      console.log('mobile berubah');
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

  return updateUserPayload;
};
