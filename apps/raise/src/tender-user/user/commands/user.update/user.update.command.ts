import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserDto } from '../../dtos/requests';
import { TenderAppRoleEnum } from '../../../../tender-commons/types';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  TenderUserRepository,
  UpdateUserProps,
} from '../../repositories/tender-user.repository';
import {
  CreateRoleProps,
  TenderUserRoleRepository,
} from '../../repositories/tender-user-role.repository';
import { v4 as uuidv4 } from 'uuid';
import { Builder } from 'builder-pattern';
import { UserStatusEnum } from '../../types/user_status';
import { FusionAuthService } from '../../../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserEntity } from '../../entities/user.entity';
export class UserUpdateCommand {
  dto: UpdateUserDto;
}

export class UserUpdateCommandResult {
  updated_user: UserEntity;
}

@CommandHandler(UserUpdateCommand)
export class UserUpdateCommandHandler
  implements ICommandHandler<UserUpdateCommand, UserUpdateCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepo: TenderUserRepository,
    private readonly fusionAuthService: FusionAuthService,
    private readonly roleRepo: TenderUserRoleRepository,
  ) {}

  async execute(command: UserUpdateCommand): Promise<UserUpdateCommandResult> {
    try {
      const { user_roles, selectLang, id, track_id } = command.dto;
      user_roles.forEach((role: TenderAppRoleEnum) => {
        if (role === TenderAppRoleEnum.CLIENT) {
          throw new BadRequestException(
            'You are note allowed to change user to Client!',
          );
        }
      });

      const isUserExist = await this.userRepo.fetchById({ id });
      if (!isUserExist) throw new NotFoundException('User Not Found!');
      if (!!isUserExist.client_data) {
        throw new BadRequestException(
          'You can only edit employee data not a client!',
        );
      }

      const createRolePayload: CreateRoleProps[] = [];

      for (let i = 0; i < user_roles.length; i++) {
        const availableRoles = await this.userRepo.validateRoles(user_roles[i]);
        if (!availableRoles) {
          throw new BadRequestException(
            `Invalid user roles!, Roles [${user_roles[i]}] is not found!`,
          );
        }

        if (availableRoles) {
          createRolePayload.push({
            id: uuidv4(),
            user_id: id,
            user_type_id: user_roles[i],
          });
        }
      }

      const track = await this.userRepo.validateTracks(track_id);
      if (!track) {
        throw new BadRequestException(
          'Invalid employee path!, Path is not found!',
        );
      }

      // const mappedRequest = UpdateUserMapper(isUserExist, request);

      const updateUserPayload = Builder<UpdateUserProps>(UpdateUserProps, {
        id,
        employee_name: command.dto.employee_name,
        email: command.dto.email,
        mobile_number: command.dto.mobile_number,
        status_id: command.dto.activate_user
          ? UserStatusEnum.ACTIVE_ACCOUNT
          : UserStatusEnum.CANCELED_ACCOUNT,
        track_id: command.dto.track_id,
      }).build();

      if (!!updateUserPayload.email) {
        const emailExist = await this.userRepo.checkExistance(
          '',
          updateUserPayload.email,
          '',
          command.dto.id,
        );
        if (emailExist.length > 0) {
          if (selectLang === 'en') {
            throw new ConflictException('Email already exist in our app!');
          } else {
            throw new ConflictException(
              'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
            );
          }
        }
      }

      if (!!updateUserPayload.mobile_number) {
        const phoneExist = await this.userRepo.checkExistance(
          '',
          updateUserPayload.mobile_number,
          '',
          command.dto.id,
        );
        if (phoneExist.length > 0) {
          throw new ConflictException('Phone already exist in our app!');
        }
      }

      const dbRes = await this.prismaService.$transaction(
        async (prismaSession) => {
          const tx =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          // delete
          await this.roleRepo.deleteByUserId(command.dto.id, tx);

          // re create
          if (createRolePayload.length > 0) {
            for (const rolePayload of createRolePayload) {
              await this.roleRepo.create(rolePayload, tx);
            }
          }

          const updatedUser = await this.userRepo.update(updateUserPayload, tx);

          if (command.dto.activate_user) {
            await this.fusionAuthService.verifyEmail(updateUserPayload.id);
          }

          await this.fusionAuthService.fusionAuthUpdateUserRegistration(id, {
            firstName:
              updateUserPayload.employee_name &&
              !!updateUserPayload.employee_name
                ? (updateUserPayload.employee_name as string)
                : undefined,
            email:
              updateUserPayload.email && !!updateUserPayload.email
                ? (updateUserPayload.email as string)
                : undefined,
            mobilePhone:
              updateUserPayload.mobile_number &&
              !!updateUserPayload.mobile_number
                ? (updateUserPayload.mobile_number as string)
                : undefined,
            address:
              updateUserPayload.address && !!updateUserPayload.address
                ? (updateUserPayload.address as string)
                : undefined,
            password: command.dto.password,
            roles: createRolePayload
              ? createRolePayload.map((role) => role.user_type_id)
              : [],
          });

          return {
            updated_user: updatedUser,
          };
        },
      );

      return {
        updated_user: dbRes.updated_user,
      };
    } catch (error) {
      throw error;
    }
  }
}
