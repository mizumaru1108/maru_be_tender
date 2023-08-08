import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { FileMimeTypeEnum } from '../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../commons/helpers/env-loaderror-helper';
import { BaseHashuraWebhookPayload } from '../../commons/interfaces/base-hashura-webhook-payload';
import { isExistAndValidPhone } from '../../commons/utils/is-exist-and-valid-phone';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import { MsegatService } from '../../libs/msegat/services/msegat.service';
import { TwilioService } from '../../libs/twilio/services/twilio.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFilesDto } from '../../tender-commons/dto/upload-files.dto';
import { TenderRepository } from '../repositories/tender.repository';

@Injectable()
export class TenderService {
  private appEnv: string;
  constructor(
    private readonly bunnyService: BunnyService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
    private readonly msegatService: MsegatService,
    private tenderRepository: TenderRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  // async uploadFiles(payload: UploadFilesDto, files: MulterFile[]) {
  async uploadFiles(payload: UploadFilesDto, files: Express.Multer.File[]) {
    // const maxSize: number = 1024 * 1024 * 1; // 1MB
    const maxSize: number = 1024 * 1024 * 512;
    const allowedType: FileMimeTypeEnum[] = [
      FileMimeTypeEnum.JPG,
      FileMimeTypeEnum.JPEG,
      FileMimeTypeEnum.PNG,
      FileMimeTypeEnum.PDF,
      FileMimeTypeEnum.DOC,
      FileMimeTypeEnum.DOCX,
      FileMimeTypeEnum.XLS,
      FileMimeTypeEnum.XLSX,
    ];
    let uploadedFileLinks = 'Uploaded file links: \n';
    try {
      const processFiles = files.map(async (file, index) => {
        // if the optionalFolderPath = "profile-pics" exist the url will be
        // /tmra/dev/organization/tender-management/userid/profile-pics/filename
        // /tmra/dev/organization/tender-management/userid/bank-info/filename

        // if u are not use the optionalFolderPath the url will be
        // /tmra/dev/organization/tender-management/userid/filename
        const path = payload.optionalFolderPath
          ? `tmra/${this.appEnv}/organization/tender-management` +
            `/${payload.userId}/${payload.optionalFolderPath}`
          : `tmra/${this.appEnv}/organization/tender-management` +
            `/${payload.userId}/proposal-files`;

        const uploaded = await this.bunnyService.oldUploadFile(
          file,
          allowedType,
          maxSize,
          'Tender Management Uploading Files',
          true,
          path,
        );
        // if (!uploaded) {
        //   throw new BadRequestException('Failed to upload file!');
        // }
        // console.log('uploaded', uploaded);
        if (uploaded) {
          uploadedFileLinks += `[${index}] ${uploaded} \n`;
        }
      });
      await Promise.all(processFiles);
      return uploadedFileLinks;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* denactive client data after editing request*/
  async postCreateEditingRequest(request: BaseHashuraWebhookPayload) {
    // console.log('id', request.event.session_variables['x-hasura-user-id']);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: request.event.session_variables['x-hasura-user-id'],
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        status_id: 'WAITING_FOR_EDITING_APPROVAL',
      },
    });

    if (!updatedUser) {
      throw new Error('something went wrong when updating client data');
    }

    return updatedUser;
  }

  /* inserting user selected roles */
  // async postInsertFollowUp(request: BaseHashuraWebhookPayload) {
  //   // console.log('userid', request.event.session_variables['x-hasura-user-id']);

  //   const userId = request.event.session_variables['x-hasura-user-id'];
  //   if (!userId) {
  //     throw new NotFoundException('User id is not found on session!');
  //   }

  //   const user = await this.tenderRepository.findUserById(userId);
  //   // console.log('user', user);
  //   if (!user) throw new NotFoundException('User not found on app!');

  //   // console.log('role', request.event.session_variables['x-hasura-role']);
  //   const selectedRole =
  //     appRoleMappers[
  //       request.event.session_variables[
  //         'x-hasura-role'
  //       ] as TenderFusionAuthRoles
  //     ];
  //   if (!selectedRole) throw new UnauthorizedException('Roles not found!');

  //   // check if selected roles are exist on user.roles.user_type_id with indexof
  //   const userRoles = user.roles.map((role) => role.user_type_id);
  //   if (userRoles.indexOf(selectedRole) === -1) {
  //     throw new UnauthorizedException(
  //       'Seleceted role are not exist on user current roles!',
  //     );
  //   }

  //   const updatedProposal = await this.tenderRepository.updateFollowUp(
  //     request.event.data.new.id,
  //     user.id,
  //     selectedRole,
  //   );

  //   return updatedProposal;
  // }

  async test(phoneNumber: string[], message: string) {
    if (!phoneNumber || !message) {
      throw new BadRequestException('Phone number and message are required');
    }
    // for each and send to all in phoneNumber array
    phoneNumber.forEach(async (number) => {
      const valid = isExistAndValidPhone(number);
      if (valid) {
        const twilioResponse = await this.twilioService.sendSMSAsync({
          to: number,
          body: valid,
        });
        console.log('twilioResponse', twilioResponse);
      }
    });
    return true;
  }

  async testMsegat(phoneNumber: string[], message: string) {
    if (!phoneNumber || !message) {
      throw new BadRequestException('Phone number and message are required');
    }
    // for each and send to all in phoneNumber array
    phoneNumber.forEach(async (number) => {
      const valid = isExistAndValidPhone(number);
      if (valid) {
        await this.msegatService.sendSMS({
          numbers: number.substring(1),
          msg: message,
        });
      }
    });
    return true;
  }

  async testOtp(phoneNumber: string[]) {
    if (!phoneNumber) {
      throw new BadRequestException('Phone number are required');
    }
    // for each and send to all in phoneNumber array
    phoneNumber.forEach(async (number) => {
      const valid = isExistAndValidPhone(number);
      if (valid) {
        await this.msegatService.sendOtp({
          number: number.substring(1),
        });
      }
    });
    return true;
  }
}
