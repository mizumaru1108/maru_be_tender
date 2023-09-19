import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenderCreateUserDto } from '../../dtos/requests';
import {
  CreateUserProps,
  TenderUserRepository,
} from '../../repositories/tender-user.repository';
import { UserEntity } from '../../entities/user.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { FusionAuthService } from '../../../../libs/fusionauth/services/fusion-auth.service';
import { UserStatusEnum } from '../../types/user_status';
import {
  CreateRoleProps,
  TenderUserRoleRepository,
} from '../../repositories/tender-user-role.repository';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateUserStatusLogProps,
  TenderUserStatusLogRepository,
} from '../../repositories/tender-user-status-log.repository';
import { PrismaService } from '../../../../prisma/prisma.service';

export class UserCreateCommand {
  dto: TenderCreateUserDto;
}

export class UserCreateCommandResult {
  data: UserEntity;
}

@CommandHandler(UserCreateCommand)
export class UserCreateCommandHandler
  implements ICommandHandler<UserCreateCommand, UserCreateCommandResult>
{
  constructor(
    private readonly userRepo: TenderUserRepository,
    private readonly roleRepo: TenderUserRoleRepository,
    private readonly statusLogRepo: TenderUserStatusLogRepository,
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

  async execute(command: UserCreateCommand): Promise<UserCreateCommandResult> {
    let fusionAuthResult: any;
    try {
      const {
        email,
        employee_name,
        mobile_number,
        activate_user,
        track_id,
        user_roles,
        selectLang,
      } = command.dto;

      // admin only created by the system.
      if (user_roles.indexOf('ADMIN') > -1) {
        throw new BadRequestException('Roles is Forbidden to create!');
      }

      // const tracks = await this.userRepo.validateTracks(track_id);
      // if (!tracks) {
      //   throw new BadRequestException(
      //     'Invalid employee track!, Path is not found!',
      //   );
      // }

      // for (let i = 0; i < user_roles.length; i++) {
      //   const availableRoles = await this.userRepo.validateRoles(user_roles[i]);
      //   if (!availableRoles) {
      //     throw new BadRequestException(
      //       `Invalid user roles!, Roles [${user_roles[i]}] is not found!`,
      //     );
      //   }
      // }

      const emailExist = await this.userRepo.findFirst({ email });
      if (emailExist) {
        if (selectLang === 'en') {
          throw new ConflictException('Email already exist in our app!');
        } else {
          throw new ConflictException(
            'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
          );
        }
      }

      const phoneExist = await this.userRepo.findFirst({ mobile_number });
      if (phoneExist) {
        throw new ConflictException('Phone already exist in our app!');
      }

      // create fusion auth user.
      fusionAuthResult =
        await this.fusionAuthService.fusionAuthTenderRegisterUser(command.dto);

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
        : UserStatusEnum.CANCELED_ACCOUNT;

      const userCreatePayload: CreateUserProps = {
        id: fusionAuthResult.user.id,
        email,
        employee_name,
        mobile_number,
        status_id: status,
        track_id,
      };

      const roleDataPayload: CreateRoleProps[] = user_roles.map((role) => {
        return {
          id: uuidv4(),
          user_id: fusionAuthResult.user.id as string,
          user_type_id: role,
        };
      });

      const statusLogPayload: CreateUserStatusLogProps[] = [
        {
          id: uuidv4(),
          user_id: fusionAuthResult.user.id as string,
          status_id: UserStatusEnum.WAITING_FOR_ACTIVATION,
        },
      ];

      // either active or inactive the fusion auth must be active [we just validate trough db] (Frisky, Umar notes)
      await this.fusionAuthService.verifyEmail(fusionAuthResult.user.id);

      if (status === UserStatusEnum.ACTIVE_ACCOUNT) {
        // await this.fusionAuthService.verifyEmail(fusionAuthResult.user.id);
        statusLogPayload.push({
          id: uuidv4(),
          user_id: fusionAuthResult.user.id as string,
          status_id: UserStatusEnum.ACTIVE_ACCOUNT,
        });
      }

      if (status === UserStatusEnum.CANCELED_ACCOUNT) {
        // await this.fusionAuthService.verifyEmail(fusionAuthResult.user.id);
        statusLogPayload.push({
          id: uuidv4(),
          user_id: fusionAuthResult.user.id as string,
          status_id: UserStatusEnum.CANCELED_ACCOUNT,
        });
      }

      const dbRes = await this.prismaService.$transaction(async (session) => {
        const tx =
          session instanceof PrismaService ? session : this.prismaService;

        const createdUser = await this.userRepo.create(userCreatePayload, tx);

        if (roleDataPayload.length > 0) {
          for (const role of roleDataPayload) {
            await this.roleRepo.create(role, tx);
          }
        }

        if (statusLogPayload.length > 0) {
          for (const statusLog of statusLogPayload) {
            await this.statusLogRepo.create(statusLog, tx);
          }
        }

        return createdUser;
      });

      return {
        data: dbRes,
      };
    } catch (error) {
      if (
        fusionAuthResult &&
        fusionAuthResult.user &&
        fusionAuthResult.user.id
      ) {
        await this.fusionAuthService.fusionAuthDeleteUser(
          fusionAuthResult.user.id,
        );
      }
      throw error;
    }
  }
}
