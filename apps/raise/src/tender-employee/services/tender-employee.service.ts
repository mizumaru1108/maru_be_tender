import { BadRequestException, Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from '../dtos/requests/create-employee.dto';

@Injectable()
export class TenderEmployeeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}

  /** Create user and client for tender completed data */
  async createEmployee(request: CreateEmployeeDto): Promise<user> {
    // admin only created by the system.
    if (request.user_roles === 'ADMIN') {
      throw new BadRequestException('Admin roles is Forbidden!');
    }

    if (request.employee_path) {
      const track = await this.prismaService.project_tracks.findUnique({
        where: { id: request.employee_path },
      });
      if (!track) {
        throw new BadRequestException(
          'Invalid employee path!, Path is not found!',
        );
      }
    }

    const availableRoles = await this.prismaService.user_type.findUnique({
      where: { id: request.user_roles },
    });
    if (!availableRoles) {
      throw new BadRequestException('Invalid user roles!, Roles is not found!');
    }

    if (
      ['CEO', 'FINANCE', 'CASHIER', 'MODERATOR'].includes(availableRoles.id)
    ) {
      // count user with same roles if more than 1 throw error
      const count = await this.prismaService.user.count({
        where: { user_type_id: availableRoles.id },
      });
      if (count > 0) {
        throw new BadRequestException(`Only 1 ${availableRoles.id} allowed!`);
      }
    }

    const emailData = await this.prismaService.user.findUnique({
      where: { email: request.email },
    });

    if (emailData) {
      throw new BadRequestException('Email already exist!');
    }

    const fusionAuthResult =
      await this.fusionAuthService.fusionAuthTenderRegisterUser(request);

    // if you want to make a type for register result
    // see trough mr danang soluvas note, theres' fustion auth register result type there for details.
    if (!fusionAuthResult.user.id) {
      throw new BadRequestException(
        'Failed to get the user id after creating fusion auth account!',
      );
    }

    const result = await this.prismaService.user.create({
      data: {
        id: fusionAuthResult.user.id,
        employee_name: request.employee_name,
        mobile_number: request.mobile_number,
        email: request.email,
        is_active: request.activate_user,
        employee_path: request.employee_path || null,
        user_type_id: request.user_roles || null,
      },
    });
    return result;
  }

  async deleteEmployee(id: string): Promise<user> {
    await this.fusionAuthService.fusionAuthDeleteUser(id);
    const result = await this.prismaService.user.delete({
      where: { id },
    });
    return result;
  }
}
