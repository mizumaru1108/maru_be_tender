import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateFileExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from '../../../tender-file-manager/repositories/tender-file-manager.repository';
import {
  CreateClientDataProps,
  TenderClientRepository,
} from '../../../tender-user/client/repositories/tender-client.repository';
import { TenderUserRoleRepository } from '../../../tender-user/user/repositories/tender-user-role.repository';
import {
  CreateUserProps,
  TenderUserRepository,
} from '../../../tender-user/user/repositories/tender-user.repository';
import { RegisterTenderDto } from '../../dtos/requests/register-tender.dto';
import { TenderAuthRepository } from '../../repositories/tender-auth.repository';
import {
  BankInformationCreateProps,
  BankInformationRepository,
} from '../../../bank/repositories/bank-information.repository';
import { ROOT_LOGGER } from '../../../libs/root-logger';

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
        throw new BadRequestException(
          'Data Entry Mobile cannot be same as Client Mobile!',
        );
      }

      if (clientPhone === ceoMobile) {
        throw new BadRequestException(
          'Phone number and CEO mobile number cannot be the same!',
        );
      }

      //  validate the track id
      if (employee_path) {
        const pathExist = await this.authRepo.validateTrack(employee_path);
        if (!pathExist) throw new BadRequestException('Invalid Employee Path!');
      }

      if (status) {
        const statusExist = await this.authRepo.validateStatus(status);
        if (!statusExist) {
          throw new BadRequestException('Invalid client status!');
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
          throw new ConflictException('Email already exist in our app!');
        } else {
          throw new ConflictException(
            'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
          );
        }
      }

      // data exist and phone number same as data entry mobile
      if (emailExist && emailExist.mobile_number === dataEntryMobile) {
        if (selectLang === 'en') {
          throw new ConflictException('Data Entry Mobile in our app!');
        } else {
          throw new ConflictException(
            'البريد الإلكتروني مُسجل بالفعل في تطبيقنا!',
          );
        }
      }

      // creating user password
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

      const createClientPayload = Builder<CreateClientDataProps>(
        CreateClientDataProps,
        {
          id: uuidv4(),
          user_id: registerFusionAuth.user.id,
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

        const createdClient = await this.clientRepo.create(
          createClientPayload,
          session,
        );

        const createdRole = await this.userRoleRepo.create(
          {
            user_id: registerFusionAuth.user.id,
            user_type_id: 'CLIENT',
          },
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
          created_client: createdClient,
          created_role: createdRole,
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
