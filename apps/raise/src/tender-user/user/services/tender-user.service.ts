import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { TenderCreateUserDto } from '../dtos/requests/create-user.dto';
import { TenderUserRepository } from '../repositories/tender-user.repository';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserResponseDto } from '../dtos/responses/create-user-response.dto';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UpdateUserPayload } from '../interfaces/update-user-payload.interface';
import { updateUserMapper } from '../mappers/update-user.mapper';

@Injectable()
export class TenderUserService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderUserService.name,
  });

  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private tenderUserRepository: TenderUserRepository,
  ) {}

  async createUser(
    request: TenderCreateUserDto,
  ): Promise<CreateUserResponseDto> {
    this.logger.log('info', 'creating user, payload:', request);

    const {
      email,
      employee_name,
      mobile_number,
      activate_user,
      employee_path,
      user_roles,
    } = request;

    // admin only created by the system.
    if (user_roles.indexOf('ADMIN') > -1) {
      throw new BadRequestException('Roles is Forbidden to create!');
    }

    const track = await this.tenderUserRepository.validateTrack(employee_path);
    if (!track) {
      throw new BadRequestException(
        'Invalid employee path!, Path is not found!',
      );
    }

    for (let i = 0; i < user_roles.length; i++) {
      const availableRoles = await this.tenderUserRepository.validateRoles(
        user_roles[i],
      );
      if (!availableRoles) {
        throw new BadRequestException(
          `Invalid user roles!, Roles [${user_roles[i]}] is not found!`,
        );
      }
    }

    // skip this validation first
    // if (user_roles.length === 1) {
    //   // if user_roles has ['CEO', 'FINANCE', 'CASHIER', 'MODERATOR'] inside it
    //   if (
    //     ['CEO', 'FINANCE', 'CASHIER', 'MODERATOR'].some((role) =>
    //       user_roles.includes(role),
    //     )
    //   ) {
    //     // count user with same roles if more than 1 throw error
    //     const count = await this.tenderUserRepository.countExistingRoles(
    //       user_roles,
    //     );
    //     if (count > 0) {
    //       throw new BadRequestException(`Only 1 ${user_roles[0]} allowed!`);
    //     }
    //   }
    // }

    const emailExist = await this.tenderUserRepository.findUser({
      email,
    });
    if (emailExist) {
      throw new ConflictException('Email already exist in our app!');
    }

    const phoneExist = await this.tenderUserRepository.findUser({
      mobile_number,
    });
    if (phoneExist) {
      throw new ConflictException('Phone already exist in our app!');
    }

    // create fusion auth user.
    const fusionAuthResult =
      await this.fusionAuthService.fusionAuthTenderRegisterUser(request);

    // if you want to make a type for register result
    // see trough mr danang soluvas note, theres' fustion auth register result type there for details.
    if (!fusionAuthResult.user.id) {
      throw new BadRequestException(
        'Failed to get the user id after creating fusion auth account!',
      );
    }

    // map as a create input
    let status = activate_user ? 'ACTIVE_ACCOUNT' : 'WAITING_FOR_ACTIVATION';
    const createUserPayload: Prisma.userCreateInput = {
      id: fusionAuthResult.user.id,
      email,
      employee_name,
      mobile_number,
      status: {
        connect: {
          id: status,
        },
      },
      employee_track: {
        connect: {
          id: employee_path,
        },
      },
    };

    const createRolesData: Prisma.user_roleUncheckedCreateInput[] =
      user_roles.map((role) => {
        return {
          id: uuidv4(),
          user_id: fusionAuthResult.user.id as string,
          user_type_id: role,
        };
      });

    const createdUser = await this.tenderUserRepository.createUser(
      createUserPayload,
      createRolesData,
    );

    if (createdUser instanceof Array) {
      return {
        createdUser: createdUser[0],
        createdRoles: createRolesData,
      };
    }

    return {
      createdUser,
    };
  }

  async deleteUserWFusionAuth(id: string) {
    const deleteResult = await this.tenderUserRepository.deleteUserWFusionAuth(
      id,
    );
    let logs = '';
    let deletedUser: user | null = null;
    console.log('delete result', deleteResult);
    logs =
      deleteResult.fusionResult === true
        ? "Fusion Auth's user deleted!"
        : 'Delete user performed successfully but user did not exist on fusion auth!';
    logs = deleteResult.prismaResult
      ? (logs += ", and Tender's user deleted!")
      : (logs +=
          ', and Delete user performed successfully but user did not exist on tender db!');
    if (typeof deleteResult.prismaResult === 'object') {
      deletedUser = deleteResult.prismaResult;
    }
    return {
      logs,
      deletedUser,
    };
  }

  async updateProfile(userId: string, request: UpdateUserDto) {
    let updateUserPayload: UpdateUserPayload = {};

    const currentUser = await this.tenderUserRepository.findUserById(userId);
    if (!currentUser) throw new NotFoundException("User doesn't exist!");

    if (request.password && !request.current_password) {
      throw new BadRequestException(
        'Current password should be provided when changing password',
      );
    }
    updateUserPayload = updateUserMapper(currentUser, request);

    const updatedUser = await this.tenderUserRepository.updateUser(
      userId,
      updateUserPayload,
    );

    return updatedUser;
  }
}
