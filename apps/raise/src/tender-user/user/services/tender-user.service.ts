import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { getTimeGap } from '../../../tender-commons/utils/get-time-gap';
import { TenderCreateUserDto } from '../dtos/requests/create-user.dto';
import { SearchUserFilterRequest } from '../dtos/requests/search-user-filter-request.dto';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { CreateUserResponseDto } from '../dtos/responses/create-user-response.dto';
import { FindUserResponse } from '../dtos/responses/find-user-response.dto';
import { TenderCurrentUser } from '../interfaces/current-user.interface';
import { UpdateUserPayload } from '../interfaces/update-user-payload.interface';
import { updateUserMapper } from '../mappers/update-user.mapper';
import { TenderUserRepository } from '../repositories/tender-user.repository';

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

    // if (request.password && !request.current_password) {
    //   throw new BadRequestException(
    //     'Current password should be provided when changing password',
    //   );
    // }
    updateUserPayload = updateUserMapper(currentUser, request);

    const queryResult = await this.tenderUserRepository.updateUserWFusionAuth(
      userId,
      updateUserPayload,
    );

    let logs = '';
    let updatedUser: user | null = null;
    // console.log('delete result', queryResult);

    logs = queryResult.prismaResult
      ? 'User profile updated on our app!'
      : 'Something went wrong when updating user profile on our app!';
    logs =
      queryResult.fusionResult === true
        ? (logs += ', User profile updated on our cloud app!')
        : (logs +=
            ', User update performed successfully but user didnt updated on coud app!');

    if (typeof queryResult.prismaResult === 'object') {
      updatedUser = queryResult.prismaResult;
    }

    return {
      updatedUser: updatedUser,
      logs,
    };
  }

  async findUsers(
    currentUser: TenderCurrentUser,
    filter: SearchUserFilterRequest,
  ): Promise<FindUserResponse> {
    const {
      sorting_field,
      hide_internal,
      hide_external,
      include_schedule,
      association_name,
      client_field,
      employee_path,
      single_role,
    } = filter;
    if (
      sorting_field &&
      [
        'employee_name',
        'employee_path',
        'email',
        'created_at',
        'updated_at',
      ].indexOf(sorting_field) === -1
    ) {
      throw new BadRequestException(
        `Sorting field by ${sorting_field} is not allowed!`,
      );
    }

    if (hide_internal === '1' && hide_external === '1') {
      throw new BadRequestException(
        "You can't hide both internal and external user!",
      );
    }

    if (hide_internal === '1' && single_role) {
      throw new BadRequestException(
        "You can't use single_role when hide the internal user!",
      );
    }

    if (hide_internal === '1' && employee_path) {
      throw new BadRequestException(
        "You can't use employee_path when hide the internal user!",
      );
    }

    if ((hide_external === '0' || !hide_external) && single_role) {
      throw new BadRequestException(
        'External must be hidden when you want to use single_role filter!',
      );
    }

    if (hide_external === '1' && include_schedule === '1') {
      throw new BadRequestException(
        "You can't hide external user when you want to include schedule!",
      );
    }

    if (hide_external === '1' && association_name) {
      throw new BadRequestException(
        "You can't hide external user when you want to search client by association name!",
      );
    }

    if (hide_external === '1' && client_field) {
      throw new BadRequestException(
        "You can't hide external user when you want to search client by association name!",
      );
    }

    if (
      hide_external === '1' &&
      (association_name || include_schedule === '1')
    ) {
      throw new BadRequestException(
        "You can't hide external user when you want to search client by association name or include schedule!",
      );
    }

    /* if loggined user is account manager, it will show all user, if not, only active user will shown */
    const findOnlyActive =
      currentUser.choosenRole === 'tender_accounts_manager' ? false : true;

    const response = await this.tenderUserRepository.findUsers(
      filter,
      findOnlyActive,
    );

    let finalResult: FindUserResponse['data'] = [];

    // only show internal user & split if user has multiple roles (like using unwind in mongodb)
    if (single_role && hide_external === '1') {
      for (const user of response.data) {
        for (const role of user.roles) {
          const data = {
            ...user,
            roles: [role],
          };
          finalResult.push(data);
        }
      }
    } else if (include_schedule === '1' && hide_internal === '1') {
      for (const user of response.data) {
        const data = {
          ...user,
        };

        if (user.schedule && user.schedule.length > 0) {
          for (const schedule of user.schedule) {
            if (schedule.start_time && schedule.end_time) {
              const gap = getTimeGap(
                schedule.start_time,
                schedule.end_time,
                15,
              );
              schedule.time_gap = gap;
            }
          }
        }

        finalResult.push(data);
      }
    } else {
      finalResult = response.data;
    }

    return {
      data: finalResult,
      total: response.total,
    };
  }
}
