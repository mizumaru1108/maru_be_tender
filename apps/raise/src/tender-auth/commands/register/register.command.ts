import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterTenderDto } from '../../dtos/requests/register-tender.dto';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';

export class RegisterClientCommand {
  request: RegisterTenderDto;
}

@CommandHandler(RegisterClientCommand)
export class RegisterClientCommandHandler
  implements ICommandHandler<RegisterClientCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepo: TenderUserRepository,
  ) {}

  async execute(command: RegisterClientCommand): Promise<any> {
    // async register(registerRequest: RegisterTenderDto) {
    //   try {
    //     const {
    //       data: {
    //         ceo_mobile: ceoMobile,
    //         data_entry_mobile: dataEntryMobile,
    //         entity_mobile: clientPhone,
    //         email,
    //         employee_path,
    //         status,
    //         selectLang,
    //       },
    //     } = registerRequest;
    //     const emailExist = await this.tenderUserRepo.findUser({
    //       email: registerRequest.data.email,
    //     });
    //     // console.log({ emailExist });
    //     if (emailExist) {
    //       if (selectLang === 'en') {
    //         throw new ConflictException('Email already exist in our app!');
    //       } else {
    //         throw new ConflictException(
    //           'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
    //         );
    //       }
    //     }
    //     const phoneExist = await this.tenderUserRepo.findUser({
    //       mobile_number: dataEntryMobile,
    //     });
    //     if (phoneExist) {
    //       throw new ConflictException('Data Entry exist in our app!');
    //     }
    //     if (dataEntryMobile === clientPhone) {
    //       throw new BadRequestException(
    //         'Data Entry Mobile cannot be same as Client Mobile!',
    //       );
    //     }
    //     if (clientPhone === ceoMobile) {
    //       throw new BadRequestException(
    //         'Phone number and CEO mobile number cannot be the same!',
    //       );
    //     }
    //     if (employee_path) {
    //       const pathExist = await this.tenderUserRepo.validateTrack(
    //         employee_path,
    //       );
    //       if (!pathExist) throw new BadRequestException('Invalid Employee Path!');
    //     }
    //     if (status) {
    //       const statusExist = await this.tenderClientRepository.validateStatus(
    //         status,
    //       );
    //       if (!statusExist) {
    //         throw new BadRequestException('Invalid client status!');
    //       }
    //     }
    //     // create user on fusion auth
    //     const fusionAuthResult =
    //       await this.fusionAuthService.fusionAuthTenderRegisterUser({
    //         email,
    //         employee_name: registerRequest.data.employee_name,
    //         password: registerRequest.data.password,
    //         mobile_number: dataEntryMobile,
    //         // mobile_number: clientPhone,
    //         user_roles: ['CLIENT'],
    //       });
    //     // if you want to make a type for register result
    //     // see trough mr danang soluvas note, theres' fustion auth register result type there for details.
    //     if (!fusionAuthResult.user.id) {
    //       throw new BadRequestException(
    //         'Failed to get the user id after creating fusion auth account!',
    //       );
    //     }
    //     const result = await this.tenderClientService.createUserAndClient(
    //       fusionAuthResult.user.id,
    //       registerRequest,
    //     );
    //     return result;
    //   } catch (error) {
    //     console.log(error);
    //     throw error;
    //   }
    // }
  }
}
