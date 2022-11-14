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

  async createEmployee(request: TenderCreateUserDto): Promise<user> {
    const {
      email,
      employee_name,
      mobile_number,
      activate_user,
      employee_path,
      user_roles,
    } = request;

    // admin only created by the system.
    if (user_roles === 'ADMIN') {
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

    const availableRoles = await this.tenderUserRepository.validateRoles(
      user_roles,
    );
    if (!availableRoles) {
      throw new BadRequestException('Invalid user roles!, Roles is not found!');
    }

    if (
      ['CEO', 'FINANCE', 'CASHIER', 'MODERATOR'].includes(availableRoles.id)
    ) {
      // count user with same roles if more than 1 throw error
      const count = await this.tenderUserRepository.countExistingRoles(
        availableRoles.id,
      );
      if (count > 0) {
        throw new BadRequestException(`Only 1 ${availableRoles.id} allowed!`);
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
      is_active: activate_user,
      user_type: {
        connect: {
          id: availableRoles.id,
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

  async deleteEmployee(id: string): Promise<user> {
    await this.fusionAuthService.fusionAuthDeleteUser(id);
    return await this.tenderUserRepository.deleteUser(id);
  }
}
