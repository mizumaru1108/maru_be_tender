import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { TenderCreateUserDto } from '../dtos/requests/create-user.dto';
import { TenderUserRepository } from '../repositories/tender-user.repository';

@Injectable()
export class TenderUserService {
  constructor(
    private readonly fusionAuthService: FusionAuthService,
    private tenderUserRepository: TenderUserRepository,
  ) {}

  async createUser(request: TenderCreateUserDto): Promise<user> {
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

    if (employee_path) {
      const track = await this.tenderUserRepository.validateTrack(
        employee_path,
      );
      if (!track) {
        throw new BadRequestException(
          'Invalid employee path!, Path is not found!',
        );
      }
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

    if (user_roles.length === 1) {
      if (
        ['CEO', 'FINANCE', 'CASHIER', 'MODERATOR'].indexOf(user_roles[0]) > -1
      ) {
        // count user with same roles if more than 1 throw error
        const count = await this.tenderUserRepository.countExistingRoles(
          user_roles[0],
        );
        if (count > 0) {
          throw new BadRequestException(`Only 1 ${user_roles[0]} allowed!`);
        }
      }
    }

    const findDuplicated = await this.tenderUserRepository.findUser({
      OR: [{ email }, { mobile_number }],
    });

    if (findDuplicated) {
      throw new BadRequestException('Email or Mobile Number already exist!');
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
    const createUserPayload: Prisma.userCreateInput = {
      id: fusionAuthResult.user.id,
      email,
      employee_name,
      mobile_number,
      user_role: user_roles,
      user_status: {
        connect: {
          id: activate_user ? 'ACTIVE_ACCOUNT' : 'WAITING_FOR_ACTIVATION',
        },
      },
    };

    if (employee_path) {
      createUserPayload.employee_track = {
        connect: {
          id: employee_path,
        },
      };
    }

    const createdUser = await this.tenderUserRepository.createUser(
      createUserPayload,
    );

    return createdUser;
  }

  async deleteUser(id: string): Promise<user> {
    await this.fusionAuthService.fusionAuthDeleteUser(id);
    return await this.tenderUserRepository.deleteUser(id);
  }
}
