import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import {
  BankInformationCreateProps,
  BankInformationRepository,
} from '../../../bank/repositories/bank-information.repository';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateFileExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from '../../../tender-file-manager/repositories/tender-file-manager.repository';
import {
  CreateClientDataProps,
  TenderClientRepository,
} from '../../../tender-user/client/repositories/tender-client.repository';
import { UserAlreadyExistException } from '../../../tender-user/user/exceptions/user-already-exist-exception.exception';
import { TenderUserRoleRepository } from '../../../tender-user/user/repositories/tender-user-role.repository';
import {
  CreateUserStatusLogProps,
  TenderUserStatusLogRepository,
} from '../../../tender-user/user/repositories/tender-user-status-log.repository';
import {
  CreateUserProps,
  TenderUserRepository,
} from '../../../tender-user/user/repositories/tender-user.repository';
import { RegisterTenderDto } from '../../dtos/requests/register-tender.dto';
import { TenderAuthRepository } from '../../repositories/tender-auth.repository';

export class RegisterClientCommand {
  request: RegisterTenderDto;
}

@CommandHandler(RegisterClientCommand)
export class RegisterClientCommandHandler
  implements ICommandHandler<RegisterClientCommand>
{
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': RegisterClientCommandHandler.name,
  });

  private readonly appEnv: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly bunnyService: BunnyService,
    private readonly prismaService: PrismaService,
    private readonly authRepo: TenderAuthRepository,
    private readonly userRepo: TenderUserRepository,
    private readonly userRoleRepo: TenderUserRoleRepository,
    private readonly userStatusLogRepo: TenderUserStatusLogRepository,
    private readonly clientRepo: TenderClientRepository,
    private readonly bankInfoRepo: BankInformationRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async uploadClientFile(
    file: TenderFilePayload,
    uploadPath: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 10, // 10 mb by default
  ) {
    try {
      const fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

      const fileBuffer = Buffer.from(
        file.base64Data.replace(/^data:.*;base64,/, ''),
        'base64',
      );

      validateFileExtension(file.fileExtension, AllowedFileTypes);
      validateFileSize(file.size, maxSize);

      const imageUrl = await this.bunnyService.uploadBase64(
        fileName,
        fileBuffer,
        uploadPath + `/${fileName}`,
      );

      const fileObj: UploadFilesJsonbDto = {
        url: imageUrl,
        type: file.fileExtension,
        size: file.size,
      };

      return {
        name: fileName,
        ...fileObj,
      };
    } catch (error) {
      throw error;
    }
  }

  async execute(command: RegisterClientCommand): Promise<any> {
    let uploadedFiles: CreateFileManagerProps[] = [];
    let createdFusionAuthId: string = '';

    try {
      const { request } = command;
      const {
        data: {
          ceo_mobile: ceoMobile,
          data_entry_mobile: dataEntryMobile,
          entity_mobile: clientPhone,
          email,
          employee_path,
          status,
          selectLang,
          employee_name,
          password,
        },
      } = request;

      if (dataEntryMobile === clientPhone) {
        throw new PayloadErrorException(
          'Data Entry Mobile cannot be same as Client Mobile!',
        );
      }

      if (clientPhone === ceoMobile) {
        throw new PayloadErrorException(
          'Phone number and CEO mobile number cannot be the same!',
        );
      }

      //  validate the track id
      if (employee_path) {
        const pathExist = await this.authRepo.validateTrack(employee_path);
        if (!pathExist) throw new PayloadErrorException('Invalid Track Id!');
      }

      if (status) {
        const statusExist = await this.authRepo.validateStatus(status);
        if (!statusExist) {
          throw new PayloadErrorException('Invalid Status Id!');
        }
      }

      // find with email, and data entry mobile as phone
      const emailExist = await this.authRepo.checkExistance(
        dataEntryMobile,
        email,
        '',
      );

      // data exist, and email same as the requested email
      if (emailExist && emailExist.email === email) {
        if (selectLang === 'en') {
          throw new UserAlreadyExistException(
            'Email already exist in our app!',
          );
        } else {
          throw new UserAlreadyExistException(
            'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
          );
        }
      }

      // data exist and phone number same as data entry mobile
      if (emailExist && emailExist.mobile_number === dataEntryMobile) {
        if (selectLang === 'en') {
          throw new UserAlreadyExistException('Data Entry Mobile in our app!');
        } else {
          throw new UserAlreadyExistException(
            'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
          );
        }
      }

      // creating user on fusion auth
      const registerFusionAuth =
        await this.fusionAuthService.fusionAuthTenderRegisterUser({
          email,
          employee_name,
          password,
          mobile_number: dataEntryMobile,
          user_roles: ['CLIENT'],
        });

      createdFusionAuthId = registerFusionAuth.user.id;

      const bankInfoId = uuidv4();

      const createUserPayload = Builder<CreateUserProps>(CreateUserProps, {
        id: registerFusionAuth.user.id,
        employee_name,
        mobile_number: dataEntryMobile,
        email,
        status_id: 'WAITING_FOR_ACTIVATION',
      }).build();

      const createUserStatusLogPayload = Builder<CreateUserStatusLogProps>(
        CreateUserStatusLogProps,
        {
          id: uuidv4(),
          user_id: registerFusionAuth.user.id,
          status_id: 'WAITING_FOR_ACTIVATION',
        },
      ).build();

      const createClientPayload = Builder<CreateClientDataProps>(
        CreateClientDataProps,
        {
          id: uuidv4(),
          user_id: registerFusionAuth.user.id,
          license_number: request.data.license_number,
          authority: request.data.authority,
          // board_ofdec_file: ofdecObj && (ofdecObj as any),
          center_administration: request.data.center_administration || null,
          ceo_mobile: request.data.ceo_mobile,
          chairman_name: request.data.chairman_name,
          chairman_mobile: request.data.chairman_mobile,
          data_entry_mail: request.data.data_entry_mail,
          data_entry_name: request.data.data_entry_name,
          data_entry_mobile: request.data.data_entry_mobile,
          ceo_name: request.data.ceo_name,
          entity_mobile: request.data.entity_mobile,
          governorate: request.data.governorate,
          region: request.data.region,
          headquarters: request.data.headquarters,
          entity: request.data.entity,
          // license_file: lisceneFileObj && {
          //   ...lisceneFileObj,
          // },
          date_of_esthablistmen: request.data.date_of_esthablistmen,
          license_expired: request.data.license_expired,
          license_issue_date: request.data.license_issue_date,
          num_of_beneficiaries: request.data.num_of_beneficiaries,
          website: request.data.website,
          twitter_acount: request.data.twitter_acount,
          num_of_employed_facility: request.data.num_of_employed_facility,
          phone: request.data.phone,
          client_field: request.data.client_field,
        },
      ).build();

      const maxSize: number = 1024 * 1024 * 100; // 100MB

      if (request.data.license_file) {
        const uploadRes = await this.uploadClientFile(
          request.data.license_file,
          `tmra/${this.appEnv}/organization/tender-management/client-data/${registerFusionAuth.user.id}/license-file`,
          [FileMimeTypeEnum.PDF],
          maxSize,
        );

        uploadedFiles.push({
          id: uuidv4(),
          user_id: registerFusionAuth.user.id,
          name: uploadRes.name,
          mimetype: uploadRes.type,
          size: uploadRes.size,
          url: uploadRes.url,
          column_name: 'license_file',
          table_name: 'client_data',
        });

        createClientPayload.license_file = {
          url: uploadRes.url,
          size: uploadRes.size,
          type: uploadRes.type,
        };
      }

      if (request.data.board_ofdec_file) {
        const uploadRes = await this.uploadClientFile(
          request.data.board_ofdec_file,
          `tmra/${this.appEnv}/organization/tender-management/client-data/${registerFusionAuth.user.id}/ofdec`,
          [FileMimeTypeEnum.PDF],
          maxSize,
        );

        uploadedFiles.push({
          id: uuidv4(),
          user_id: registerFusionAuth.user.id,
          name: uploadRes.name,
          mimetype: uploadRes.type,
          size: uploadRes.size,
          url: uploadRes.url,
          column_name: 'board_ofdec_file',
          table_name: 'client_data',
        });

        createClientPayload.board_ofdec_file = {
          url: uploadRes.url,
          size: uploadRes.size,
          type: uploadRes.type,
        };
      }

      const bankInfoPayload = Builder<BankInformationCreateProps>({
        id: uuidv4(),
        bank_account_name: request.data.bank_informations.bank_account_name,
        bank_account_number: request.data.bank_informations.bank_account_number,
        bank_id: request.data.bank_informations.bank_id,
      }).build();

      if (request.data.bank_informations) {
        const uploadRes = await this.uploadClientFile(
          request.data.board_ofdec_file,
          `tmra/${this.appEnv}/organization/tender-management/client-data/${registerFusionAuth.user.id}/bank-info`,
          [FileMimeTypeEnum.JPEG, FileMimeTypeEnum.JPG, FileMimeTypeEnum.PNG],
          maxSize,
        );

        uploadedFiles.push({
          id: uuidv4(),
          user_id: registerFusionAuth.user.id,
          name: uploadRes.name,
          mimetype: uploadRes.type,
          size: uploadRes.size,
          url: uploadRes.url,
          column_name: 'card_image',
          table_name: 'bank_information',
          bank_information_id: bankInfoId,
        });

        bankInfoPayload.card_image = {
          size: uploadRes.size,
          type: uploadRes.type,
          url: uploadRes.url,
        };
      }

      return await this.prismaService.$transaction(async (prismaSession) => {
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        const createdUser = await this.userRepo.create(
          createUserPayload,
          session,
        );

        const createdRole = await this.userRoleRepo.create(
          {
            user_id: registerFusionAuth.user.id,
            user_type_id: 'CLIENT',
          },
          session,
        );

        const createdUserStatusLog = await this.userStatusLogRepo.create(
          createUserStatusLogPayload,
          session,
        );

        const createdClient = await this.clientRepo.create(
          createClientPayload,
          session,
        );

        if (uploadedFiles.length > 0) {
          for (const file of uploadedFiles) {
            await this.fileManagerRepo.create(file, session);
          }
        }

        const createdBankInfo = await this.bankInfoRepo.create(
          bankInfoPayload,
          session,
        );

        return {
          created_user: createdUser,
          created_role: createdRole,
          created_user_status_log: createdUserStatusLog,
          created_client: createdClient,
          created_files: uploadedFiles,
          created_bank_info: createdBankInfo,
        };
      });
    } catch (error) {
      if (uploadedFiles.length > 0) {
        this.logger.log(
          'info',
          `error occured on creating client, deleting file that has been uploaded`,
        );
        for (const file of uploadedFiles) {
          await this.bunnyService.deleteMedia(file.url, true);
        }
      }
      if (createdFusionAuthId !== '') {
        this.logger.log(
          'info',
          `error occured on creating client, the user from fusion auth`,
        );
        await this.fusionAuthService.fusionAuthDeleteUser(createdFusionAuthId);
      }
      throw error;
    }
  }
}
