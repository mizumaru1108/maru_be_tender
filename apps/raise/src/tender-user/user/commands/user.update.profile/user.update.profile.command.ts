import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FusionAuthService } from '../../../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TenderClientRepository } from '../../../client/repositories/tender-client.repository';
import { UpdateProfileDto } from '../../dtos/requests';
import { UserEntity } from '../../entities/user.entity';
import { TenderCurrentUser } from '../../interfaces/current-user.interface';
import {
  TenderUserRepository,
  UpdateUserProps,
} from '../../repositories/tender-user.repository';

export class UserUpdateProfileCommand {
  currentUser: TenderCurrentUser;
  request: UpdateProfileDto;
}

export class UserUpdateProfileCommandResult {
  data: UserEntity;
}

@CommandHandler(UserUpdateProfileCommand)
export class UserUpdateProfileCommandHandler
  implements
    ICommandHandler<UserUpdateProfileCommand, UserUpdateProfileCommandResult>
{
  constructor(
    private readonly userRepo: TenderUserRepository,
    private readonly clientRepo: TenderClientRepository,
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

  async execute(
    command: UserUpdateProfileCommand,
  ): Promise<UserUpdateProfileCommandResult> {
    try {
      const existingUserData = await this.userRepo.findFirst({
        id: command.currentUser.id,
        includes_relation: ['client_data'],
      });
      // console.log({ existingUserData });
      if (!existingUserData) throw new NotFoundException("User doesn't exist!");

      const valid = await this.fusionAuthService.login(
        existingUserData.email,
        command.request.current_password,
      );
      if (!valid) throw new BadRequestException('Wrong Credentials!');

      const updateUserPayload: UpdateUserProps = {
        id: existingUserData.id,
        email: command.request.email,
        employee_name: command.request.employee_name,
        address: command.request.address,
        mobile_number: command.request.mobile_number,
      };

      if (
        command.request.email &&
        command.request.email !== existingUserData.email
      ) {
        const isEmailExist = await this.userRepo.checkExistance(
          '',
          command.request.email,
          '',
          existingUserData.id,
        );
        if (isEmailExist.length > 0) {
          throw new BadRequestException('Email already exist');
        }
      }

      if (
        command.request.mobile_number &&
        command.request.mobile_number !== existingUserData.mobile_number
      ) {
        const isNumExist = await this.userRepo.checkExistance(
          command.request.mobile_number,
          '',
          '',
          existingUserData.id,
        );
        if (isNumExist.length > 0) {
          throw new BadRequestException('رقم الجوال  المستخدم وموجود بالفعل!');
        }
      }

      const dbRes = await this.prismaService.$transaction(async (session) => {
        const tx =
          session instanceof PrismaService ? session : this.prismaService;

        if (command.currentUser.choosenRole === 'tender_client') {
          // console.log(existingUserData.client_data);
          if (!existingUserData.client_data) {
            throw new UnprocessableEntityException(
              `Unable to fetch client data!`,
            );
          }
          const clientId = existingUserData.client_data!.id!;

          if (command.request.mobile_number) {
            await this.clientRepo.update(
              {
                id: clientId,
                data_entry_mobile: command.request.mobile_number,
              },
              tx,
            );
          }
        }

        const updatedUser = await this.userRepo.update(updateUserPayload, tx);

        // const updatedFusion =
        await this.fusionAuthService.fusionAuthUpdateUserRegistration(
          existingUserData.id,
          {
            firstName:
              command.request.employee_name && !!command.request.employee_name
                ? (command.request.employee_name as string)
                : undefined,
            email:
              command.request.email && !!command.request.email
                ? (command.request.email as string)
                : undefined,
            mobilePhone:
              command.request.mobile_number && !!command.request.mobile_number
                ? (command.request.mobile_number as string)
                : undefined,
            address:
              command.request.address && !!command.request.address
                ? (command.request.address as string)
                : undefined,
            password: command.request.new_password,
          },
        );

        return {
          updated_user: updatedUser,
        };
      });

      return {
        data: dbRes.updated_user,
      };
    } catch (error) {
      throw error;
    }
  }
}
