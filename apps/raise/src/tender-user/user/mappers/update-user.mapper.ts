import { user, client_data, user_role } from '@prisma/client';
import { UpdateUserDto } from '../dtos/requests';
import { UpdateUserPayload } from '../interfaces/update-user-payload.interface';
import { UserStatusEnum } from '../types/user_status';
export const UpdateUserMapper = (
  existingData: user & {
    client_data: client_data | null;
    roles: user_role[];
  },
  request: UpdateUserDto,
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

  if (
    request.mobile_number &&
    request.mobile_number !== existingData.mobile_number
  ) {
    updateUserPayload.mobile_number = request.mobile_number;
  }

  if (request.password) {
    updateUserPayload.password = request.password;
  }

  if (
    existingData.status_id === UserStatusEnum.ACTIVE_ACCOUNT &&
    !request.activate_user
  ) {
    updateUserPayload.status_id = UserStatusEnum.SUSPENDED_ACCOUNT;
  }

  if (
    existingData.status_id !== UserStatusEnum.ACTIVE_ACCOUNT &&
    request.activate_user
  ) {
    updateUserPayload.status_id = UserStatusEnum.ACTIVE_ACCOUNT;
  }

  if (
    request.employee_path &&
    request.employee_path !== existingData.employee_path
  ) {
    updateUserPayload.employee_path = request.employee_path;
  }

  return updateUserPayload;
};
