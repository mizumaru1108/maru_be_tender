import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';
import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../../libs/email/email.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { TwilioService } from '../../../libs/twilio/services/twilio.service';
import {
  TenderAppRoleEnum,
  TenderFusionAuthRolesEnum,
} from '../../../tender-commons/types';
import { getTimeGap } from '../../../tender-commons/utils/get-time-gap';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';
import {
  TenderCreateUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  SearchUserFilterRequest,
  UserStatusUpdateDto,
} from '../dtos/requests';
import { CreateUserResponseDto } from '../dtos/responses/create-user-response.dto';
import { FindUserResponse } from '../dtos/responses/find-user-response.dto';
import { IUserStatusLogResponseDto } from '../dtos/responses/user-status-log-response.dto';
import { TenderCurrentUser } from '../interfaces/current-user.interface';
import { UpdateUserPayload } from '../interfaces/update-user-payload.interface';
import { UpdateProfileMapper, UpdateUserMapper } from '../mappers';

import { TenderUserRepository } from '../repositories/tender-user.repository';
import { UserStatusEnum } from '../types/user_status';

@Injectable()
export class TenderUserService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderUserService.name,
  });

  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private readonly tenderNotificationService: TenderNotificationService,
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService,
    private readonly userRepo: TenderUserRepository,
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
      track_id,
      user_roles,
      selectLang,
    } = request;

    // admin only created by the system.
    if (user_roles.indexOf('ADMIN') > -1) {
      throw new BadRequestException('Roles is Forbidden to create!');
    }

    const tracks = await this.userRepo.validateTracks(track_id);
    if (!tracks) {
      throw new BadRequestException(
        'Invalid employee track!, Path is not found!',
      );
    }

    const track = await this.userRepo.validateTrack(employee_path);
    if (!track) {
      throw new BadRequestException(
        'Invalid employee path!, Path is not found!',
      );
    }

    for (let i = 0; i < user_roles.length; i++) {
      const availableRoles = await this.userRepo.validateRoles(user_roles[i]);
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
    //     const count = await this.userRepo.countExistingRoles(
    //       user_roles,
    //     );
    //     if (count > 0) {
    //       throw new BadRequestException(`Only 1 ${user_roles[0]} allowed!`);
    //     }
    //   }
    // }

    const emailExist = await this.userRepo.findUser({
      email,
    });
    if (emailExist) {
      if (selectLang === 'en') {
        throw new ConflictException('Email already exist in our app!');
      } else {
        throw new ConflictException(
          'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
        );
      }
    }

    const phoneExist = await this.userRepo.findUser({
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
    const status = activate_user
      ? UserStatusEnum.ACTIVE_ACCOUNT
      : UserStatusEnum.WAITING_FOR_ACTIVATION;
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

    const createStatusLogPayload: Prisma.user_status_logUncheckedCreateInput[] =
      [
        {
          id: uuidv4(),
          user_id: fusionAuthResult.user.id as string,
          status_id: UserStatusEnum.WAITING_FOR_ACTIVATION,
        },
      ] as Prisma.user_status_logUncheckedCreateInput[];

    if (status === UserStatusEnum.ACTIVE_ACCOUNT) {
      createStatusLogPayload.push({
        id: uuidv4(),
        user_id: fusionAuthResult.user.id as string,
        status_id: UserStatusEnum.ACTIVE_ACCOUNT,
      });
    }

    const createdUser = await this.userRepo.createUser(
      createUserPayload,
      createStatusLogPayload,
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
    const deleteResult = await this.userRepo.deleteUserWFusionAuth(id);
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

  async updateProfile(
    currentUser: TenderCurrentUser,
    request: UpdateProfileDto,
  ) {
    const existingUserData = await this.userRepo.findUserById(currentUser.id);
    if (!existingUserData) throw new NotFoundException("User doesn't exist!");

    const valid = await this.fusionAuthService.login(
      existingUserData.email,
      request.current_password,
    );
    if (!valid) throw new BadRequestException('Wrong Credentials!');

    let updateUserPayload: UpdateUserPayload = {};

    updateUserPayload = UpdateProfileMapper(
      existingUserData,
      request,
      currentUser,
    );

    const queryResult = await this.userRepo.updateUserWFusionAuth(
      currentUser.id,
      updateUserPayload,
    );

    let logs = '';
    let updatedUser: user | null = null;

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

  async updateUserData(request: UpdateUserDto) {
    const { user_roles, selectLang, id, employee_path } = request;
    user_roles.forEach((role: TenderAppRoleEnum) => {
      if (role === TenderAppRoleEnum.CLIENT) {
        throw new BadRequestException(
          'You are note allowed to change user to Client!',
        );
      }
    });

    const isUserExist = await this.userRepo.findUserById(id);
    if (!isUserExist) throw new NotFoundException('User Not Found!');
    if (!!isUserExist.client_data) {
      throw new BadRequestException(
        'You can only edit employee data not a client!',
      );
    }

    const createRolesData: Prisma.user_roleUncheckedCreateInput[] = [];

    for (let i = 0; i < user_roles.length; i++) {
      const availableRoles = await this.userRepo.validateRoles(user_roles[i]);
      if (!availableRoles) {
        throw new BadRequestException(
          `Invalid user roles!, Roles [${user_roles[i]}] is not found!`,
        );
      }

      if (availableRoles) {
        createRolesData.push({
          id: uuidv4(),
          user_id: id,
          user_type_id: user_roles[i],
        });
      }
    }

    const track = await this.userRepo.validateTrack(employee_path);
    if (!track) {
      throw new BadRequestException(
        'Invalid employee path!, Path is not found!',
      );
    }

    const mappedRequest = UpdateUserMapper(isUserExist, request);

    if (!!mappedRequest.email) {
      const emailExist = await this.userRepo.findUser({
        email: mappedRequest.email as string,
      });
      if (emailExist) {
        if (selectLang === 'en') {
          throw new ConflictException('Email already exist in our app!');
        } else {
          throw new ConflictException(
            'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
          );
        }
      }
    }

    if (!!mappedRequest.mobile_number) {
      const phoneExist = await this.userRepo.findUser({
        mobile_number: mappedRequest.mobile_number as string,
      });
      if (phoneExist) {
        throw new ConflictException('Phone already exist in our app!');
      }
    }

    const queryResult = await this.userRepo.updateUserWFusionAuth(
      id,
      mappedRequest,
      createRolesData,
    );

    let logs = '';
    let updatedUser: user | null = null;

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

    const response = await this.userRepo.findUsers(filter, findOnlyActive);

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

  async findById(id: string): Promise<user | null> {
    return await this.userRepo.findUserById(id);
  }

  async updateUserStatus(accManagerId: string, request: UserStatusUpdateDto) {
    if (request.status === UserStatusEnum.SUSPENDED_ACCOUNT) {
      const haveProposal = await this.userRepo.isUserHasProposal(
        request.user_id,
      );

      if (haveProposal.length > 0) {
        throw new BadRequestException(
          'Cant suspend user, user still have ongoing proposal!',
        );
      }
    }
    const response = await this.userRepo.changeUserStatus(
      request.user_id,
      request.status,
      accManagerId,
    );
    await this.sendChangeStatusNotification(
      response.user_status_log,
      request.selectLang,
    );
    return response;
  }

  async sendChangeStatusNotification(
    status_log: IUserStatusLogResponseDto['data'],
    selected_language?: 'ar' | 'en',
  ) {
    let subject = '';
    let clientContent = '';
    const employeeContent = `You have changed the account status of ${status_log.user_detail.email} to ${status_log.user_status.id}`;
    if (status_log.user_status.id === UserStatusEnum.ACTIVE_ACCOUNT) {
      subject = 'Your account has been activated!';
      clientContent = `Your account (${status_log.user_detail.email}) has been activated by the Account Manager`;
    } else if (
      status_log.user_status.id === UserStatusEnum.WAITING_FOR_ACTIVATION
    ) {
      subject = "You're account is waiting for activation!";
      clientContent =
        'You have been successfully registered as a user on tender-app, please be patience untill your account being reviewed and approved!';
    } else if (status_log.user_status.id === UserStatusEnum.SUSPENDED_ACCOUNT) {
      subject = 'Your account has been suspended!';
      clientContent = `Your account (${status_log.user_detail.email}) has been suspended by the Account Manager`;
    } else if (status_log.user_status.id === UserStatusEnum.CANCELED_ACCOUNT) {
      subject = 'Your account has been canceled!';
      clientContent = `Your account (${status_log.user_detail.email}) has been canceled by the Account Manager`;
    } else if (status_log.user_status.id === UserStatusEnum.REVISED_ACCOUNT) {
      subject = 'Your account has been revised!';
      clientContent = `Your account (${status_log.user_detail.email}) has been revised by the Account Manager`;
    } else if (
      status_log.user_status.id === UserStatusEnum.WAITING_FOR_EDITING_APPROVAL
    ) {
      subject = 'Your account editing request has been sent!';
      clientContent = `Your account editing request has been sent to the Account Manager, please be patience untill your account being reviewed and approved!`;
    }

    // email notification
    const clientEmailNotifPayload: SendEmailDto = {
      mailType: 'plain',
      to: status_log.user_detail.email,
      from: 'no-reply@hcharity.org',
      subject,
      content: clientContent,
    };

    if (status_log.user_status.id === UserStatusEnum.SUSPENDED_ACCOUNT) {
      clientEmailNotifPayload.mailType = 'template';
      clientEmailNotifPayload.templatePath = `tender/${
        selected_language || 'ar'
      }/account/account_deactivation`;
      clientEmailNotifPayload.templateContext = {
        name: status_log.user_detail.employee_name || 'Client...',
      };
    }
    this.emailService.sendMail(clientEmailNotifPayload);

    const clientWebNotifPayload: CreateNotificationDto = {
      type: 'ACCOUNT',
      specific_type: 'NEW_SUSPENDED_ACCOUNT',
      user_id: status_log.user_detail.id,
      subject,
      content: clientContent,
    };
    this.tenderNotificationService.create(clientWebNotifPayload);

    const clientPhone = isExistAndValidPhone(
      status_log.user_detail.mobile_number,
    );
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: subject + ',' + clientContent,
      });
    }

    if (status_log.account_manager_detail) {
      const employeeEmailNotifPayload: SendEmailDto = {
        mailType: 'plain',
        to: status_log.account_manager_detail.email,
        from: 'no-reply@hcharity.org',
        subject,
        content: employeeContent,
      };
      this.emailService.sendMail(employeeEmailNotifPayload);

      const employeeWebNotifPayload: CreateNotificationDto = {
        type: 'ACCOUNT',
        specific_type: 'NEW_SUSPENDED_ACCOUNT',
        user_id: status_log.account_manager_detail.id,
        subject,
        content: employeeContent,
      };
      this.tenderNotificationService.create(employeeWebNotifPayload);

      const accManagerPhone = isExistAndValidPhone(
        status_log.account_manager_detail.mobile_number,
      );
      if (accManagerPhone) {
        this.twilioService.sendSMS({
          to: accManagerPhone,
          body: subject + ',' + employeeContent,
        });
      }
    }
  }
}
