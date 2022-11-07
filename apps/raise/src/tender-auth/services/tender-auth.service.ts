import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TenderClientService } from '../../tender-client/services/tender-client.service';
import { RegisterTenderDto } from '../dtos/requests/register-tender.dto';

@Injectable()
export class TenderAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly tenderClientService: TenderClientService,
  ) {}

  async register(registerRequest: RegisterTenderDto) {
    const emailData = await this.prismaService.user.findUnique({
      where: { email: registerRequest.data.email },
    });

    if (emailData) {
      throw new BadRequestException('Email already exist');
    }

    const clientData = await this.prismaService.client_data.findFirst({
      where: {
        OR: [
          { id: registerRequest.data.id },
          { license_number: registerRequest.data.license_number },
        ],
      },
    });

    if (clientData) {
      throw new BadRequestException('License number or id already exist!');
    }

    const track = await this.prismaService.project_tracks.findUnique({
      where: { id: registerRequest.data.employee_path },
    });
    if (!track) {
      throw new BadRequestException(
        'Invalid employee path!, Path is not found!',
      );
    }

    // create user on fusion auth
    const fusionAuthResult =
      await this.fusionAuthService.fusionAuthTenderRegisterUser({
        email: registerRequest.data.email,
        employee_name: registerRequest.data.employee_name,
        password: registerRequest.data.password,
        mobile_number: registerRequest.data.phone,
      });

    // if you want to make a type for register result
    // see trough mr danang soluvas note, theres' fustion auth register result type there for details.
    if (!fusionAuthResult.user.id) {
      throw new BadRequestException(
        'Failed to get the user id after creating fusion auth account!',
      );
    }

    const result = await this.tenderClientService.createUserAndClient(
      fusionAuthResult.user.id,
      registerRequest,
    );

    return result;
  }
}
