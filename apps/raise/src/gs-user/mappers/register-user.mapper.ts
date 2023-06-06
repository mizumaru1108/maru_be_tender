import { User } from '../../user/schema/user.schema';
import { GSRegisterRequestDto } from '../../gs-auth/dtos/requests/gs-register-request.dto';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export function GSRegisterUserMapper(request: GSRegisterRequestDto) {
  const user = new User();
  user._id = uuidv4();
  user.email = request.email;
  user.password = request.password;
  user.firstname = request.firstName;
  user.lastname = request.lastName;
  user.organizationId = request.organizationId
    ? new Types.ObjectId(request.organizationId)
    : null;
  return user;
}
