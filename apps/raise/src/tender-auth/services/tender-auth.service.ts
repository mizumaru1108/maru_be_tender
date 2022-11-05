import { HttpException, Injectable } from '@nestjs/common';
import { RegisterTendersDto } from '../../auth/dtos';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TenderEmployeeService } from '../../tender-employee/services/tender-employee.service';

@Injectable()
export class TenderAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fusionAuthService: FusionAuthService,
  ) {}
}
