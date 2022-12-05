import { user } from '@prisma/client';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UpdateUserPayload } from '../interfaces/update-user-payload.interface';

export const updateUserMapper = (
  currentUser: user,
  request: UpdateUserDto,
): UpdateUserPayload => {
  const updateUserPayload: UpdateUserPayload = {};

  if (
    request.employee_name &&
    request.employee_name !== currentUser.employee_name
  ) {
    updateUserPayload.employee_name = request.employee_name;
  }

  if (request.email && request.email !== currentUser.email) {
    updateUserPayload.email = request.email;
  }

  if (request.address && request.address !== currentUser.address) {
    updateUserPayload.address = request.address;
  }

  if (
    request.mobile_number &&
    request.mobile_number !== currentUser.mobile_number
  ) {
    updateUserPayload.mobile_number = request.mobile_number;
  }

  if (request.password && request.current_password) {
    updateUserPayload.password = request.password;
    updateUserPayload.current_password = request.current_password;
  }

  return updateUserPayload;
};
