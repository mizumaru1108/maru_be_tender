import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

import { ConfigService } from '@nestjs/config';
import { bank_information, client_data, Prisma } from '@prisma/client';
import moment from 'moment';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileUploadSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../../libs/email/email.service';
import { FusionAuthService } from '../../../libs/fusionauth/services/fusion-auth.service';
import { TwilioService } from '../../../libs/twilio/services/twilio.service';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import { isUploadFileJsonb } from '../../../tender-commons/utils/is-upload-file-jsonb';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { ClientEditRequestFieldDto } from '../dtos/requests/client-edit-request-field.dto';
import { RejectEditRequestDto } from '../dtos/requests/reject-edit-request.dto';
import { SearchEditRequestFilter } from '../dtos/requests/search-edit-request-filter-request.dto';
import { RawCreateEditRequestResponse } from '../dtos/responses/raw-create-edit-request-response.dto';
import { RawResponseEditRequestDto } from '../dtos/responses/raw-response-edit-request-response.dto';
import { ApproveEditRequestMapper } from '../mappers/approve-edit-request.mapper';
import { TenderClientRepository } from '../repositories/tender-client.repository';

import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateNotificationDto } from '../../../notification-management/notification/dtos/requests/create-notification.dto';
import { TenderNotificationRepository } from '../../../notification-management/notification/repository/tender-notification.repository';
import { TenderNotificationService } from '../../../notification-management/notification/services/tender-notification.service';
import { finalUploadFileJson } from '../../../tender-commons/dto/final-upload-file-jsonb.dto';
import { TenderUserRepository } from '../../user/repositories/tender-user.repository';
import { SearchClientProposalFilter } from '../dtos/requests/search-client-proposal-filter-request.dto';
import { SearchSpecificClientProposalFilter } from '../dtos/requests/search-specific-client-proposal-filter-request.dto';
import { logUtil } from '../../../commons/utils/log-util';
@Injectable()
export class TenderClientService {
  private readonly appEnv: string;
  // private readonly logger = ROOT_LOGGER.child({
  //   'log.logger': TenderClientService.name,
  // });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly notificationService: TenderNotificationService,
    private readonly twilioService: TwilioService,
    private readonly tenderNotifRepo: TenderNotificationRepository,
    private readonly tenderUserRepository: TenderUserRepository,
    private tenderClientRepository: TenderClientRepository,
    @InjectPinoLogger(TenderClientService.name) private logger: PinoLogger,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async getUserTrack(userId: string): Promise<string | null> {
    try {
      const track = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          employee_path: true,
        },
      });
      return track?.employee_path || null;
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(error);
    }
  }

  // create user and it's relation to client_data table by user_id in client_data table
  // async createUserAndClient(
  //   idFromFusionAuth: string,
  //   request: RegisterTenderDto,
  // ): Promise<any> {
  //   let uploadedFilePath: string[] = [];
  //   try {
  //     let userCreatePayload: Prisma.userCreateInput = CreateClientMapper(
  //       idFromFusionAuth,
  //       request,
  //     );

  //     const createStatusLogPayload: Prisma.user_status_logUncheckedCreateInput[] =
  //       [
  //         {
  //           id: uuidv4(),
  //           user_id: idFromFusionAuth,
  //           status_id: UserStatusEnum.WAITING_FOR_ACTIVATION,
  //         },
  //       ] as Prisma.user_status_logUncheckedCreateInput[];

  //     let bankCreatePayload:
  //       | Prisma.bank_informationUncheckedCreateInput
  //       | undefined = undefined;

  //     let lisceneFileObj: UploadFilesJsonbDto | undefined = undefined;
  //     const ofdecObj: UploadFilesJsonbDto[] = [];
  //     let bankCardObj: UploadFilesJsonbDto | undefined = undefined;

  //     const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
  //       [];

  //     const maxSize: number = 1024 * 1024 * 8; // 8MB

  //     // make the upload file on this service into another service that can used globally on this service (diffrent case with bunny service)
  //     if (request.data.license_file) {
  //       const uploadResult = await this.uploadClientFile(
  //         idFromFusionAuth,
  //         'Uploading Liscene File for user',
  //         request.data.license_file,
  //         'license-file',
  //         [
  //           FileMimeTypeEnum.JPG,
  //           FileMimeTypeEnum.JPEG,
  //           FileMimeTypeEnum.PNG,
  //           FileMimeTypeEnum.PDF,
  //         ],
  //         maxSize,
  //         uploadedFilePath,
  //         true,
  //       );
  //       uploadedFilePath = uploadResult.uploadedFilePath;
  //       lisceneFileObj = uploadResult.fileObj;

  //       const payload: Prisma.file_managerUncheckedCreateInput = {
  //         id: uuidv4(),
  //         user_id: idFromFusionAuth,
  //         name: uploadResult.fileObj.url.split('/').pop() as string,
  //         url: uploadResult.fileObj.url,
  //         mimetype: uploadResult.fileObj.type,
  //         size: uploadResult.fileObj.size,
  //         column_name: 'license_file',
  //         table_name: 'client_data',
  //       };
  //       fileManagerCreateManyPayload.push(payload);
  //     }

  //     if (request.data.board_ofdec_file) {
  //       const uploadResult = await this.uploadClientFile(
  //         idFromFusionAuth,
  //         'Uploading Board Ofdec File for user',
  //         request.data.board_ofdec_file,
  //         'ofdec',
  //         [
  //           FileMimeTypeEnum.JPG,
  //           FileMimeTypeEnum.JPEG,
  //           FileMimeTypeEnum.PNG,
  //           FileMimeTypeEnum.PDF,
  //           // FileMimeTypeEnum.DOC,
  //           // FileMimeTypeEnum.DOCX,
  //           // FileMimeTypeEnum.XLS,
  //           // FileMimeTypeEnum.XLSX,
  //           // FileMimeTypeEnum.PPT,
  //           // FileMimeTypeEnum.PPTX,
  //         ],
  //         maxSize,
  //         uploadedFilePath,
  //         true,
  //       );
  //       uploadedFilePath = uploadResult.uploadedFilePath;

  //       const payload: Prisma.file_managerUncheckedCreateInput = {
  //         id: uuidv4(),
  //         user_id: idFromFusionAuth,
  //         name: uploadResult.fileObj.url.split('/').pop() as string,
  //         url: uploadResult.fileObj.url,
  //         mimetype: uploadResult.fileObj.type,
  //         size: uploadResult.fileObj.size,
  //         column_name: 'board_ofdec_file',
  //         table_name: 'client_data',
  //       };
  //       fileManagerCreateManyPayload.push(payload);

  //       ofdecObj.push(uploadResult.fileObj);
  //     }

  //     if (request.data.bank_informations) {
  //       const uploadResult = await this.uploadClientFile(
  //         idFromFusionAuth,
  //         'Uploading Bank Card Image File for user',
  //         request.data.bank_informations.card_image,
  //         'bank-info',
  //         [FileMimeTypeEnum.JPG, FileMimeTypeEnum.JPEG, FileMimeTypeEnum.PNG],
  //         maxSize,
  //         uploadedFilePath,
  //         true,
  //       );
  //       uploadedFilePath = uploadResult.uploadedFilePath;

  //       bankCardObj = uploadResult.fileObj;

  //       const bankInfo = await this.prismaService.banks.findFirst({
  //         where: {
  //           id: request.data.bank_informations.bank_id,
  //         },
  //       });

  //       if (!bankInfo) {
  //         throw new BadRequestException('Invalid Bank Id!');
  //       }

  //       const newBankInformations: RegisterTenderDto['data']['bank_informations'] =
  //         {
  //           ...request.data.bank_informations,
  //         };

  //       bankCreatePayload = BankInformationsMapper(
  //         idFromFusionAuth,
  //         newBankInformations,
  //         bankCardObj,
  //       );

  //       const payload: Prisma.file_managerUncheckedCreateInput = {
  //         id: uuidv4(),
  //         user_id: idFromFusionAuth,
  //         name: uploadResult.fileObj.url.split('/').pop() as string,
  //         url: uploadResult.fileObj.url,
  //         mimetype: uploadResult.fileObj.type,
  //         size: uploadResult.fileObj.size,
  //         column_name: 'card_image',
  //         table_name: 'bank_information',
  //         bank_information_id: bankCreatePayload.id,
  //       };
  //       fileManagerCreateManyPayload.push(payload);
  //     }

  //     userCreatePayload = UserClientDataMapper(
  //       userCreatePayload,
  //       request,
  //       lisceneFileObj,
  //       ofdecObj,
  //     );

  //     // const createManyWebNotif: Prisma.notificationCreateManyInput[] = [];

  //     const createUserResult = await this.tenderUserRepository.createUser(
  //       userCreatePayload,
  //       createStatusLogPayload,
  //       undefined,
  //       bankCreatePayload,
  //       fileManagerCreateManyPayload,
  //       uploadedFilePath,
  //     );

  //     const createdUser: (user & any[]) | user =
  //       createUserResult instanceof Array
  //         ? createUserResult[0]
  //         : createUserResult;

  //     // createManyWebNotif.push({
  //     //   id: uuidv4(),
  //     //   user_id: createdUser.id,
  //     //   content: 'Account Successfully Registered!',
  //     //   subject: 'Account Registered Successfully!',
  //     //   type: 'ACCOUNT',
  //     //   specific_type: 'NEW_ACCOUNT_CREATED',
  //     // });

  //     // const accountsManager = await this.tenderUserRepository.findByRole(
  //     //   'ACCOUNTS_MANAGER',
  //     // );

  //     // const accountManagerSubject = "There's new Account Created!";
  //     // const accountManagerContent = `There's new Account Created!, account name: ${createdUser.employee_name}`;
  //     // const accountManagerIds: string[] = [];
  //     // const accountMangerEmails: string[] = [];
  //     // const accountManagerMobileNumbers: string[] = [];

  //     // if (accountsManager.length > 0) {
  //     //   accountsManager.forEach((accManager) => {
  //     //     accountManagerIds.push(accManager.id);
  //     //     accountMangerEmails.push(accManager.email);
  //     //     accountManagerMobileNumbers.push(accManager.mobile_number || '');
  //     //     createManyWebNotif.push({
  //     //       id: uuidv4(),
  //     //       user_id: accManager.id,
  //     //       content: accountManagerContent,
  //     //       subject: accountManagerSubject,
  //     //       type: 'ACCOUNT',
  //     //       specific_type: 'NEW_ACCOUNT_CREATED',
  //     //     });
  //     //   });
  //     // }

  //     // const notifPayload: CommonNotificationMapperResponse = {
  //     //   logTime: moment(new Date().getTime()).format('llll'),
  //     //   clientSubject: 'Account Created Successfully!',
  //     //   clientId:
  //     //     createdUser instanceof Array ? [createdUser[0].id] : [createdUser.id],
  //     //   clientEmail:
  //     //     createdUser instanceof Array
  //     //       ? [createdUser[0].email]
  //     //       : [createdUser.email],
  //     //   clientMobileNumber:
  //     //     createdUser instanceof Array
  //     //       ? [createdUser[0].mobile_number]
  //     //       : [createdUser.mobile_number],
  //     //   clientEmailTemplatePath: `tender/${
  //     //     request.data.selectLang || 'ar'
  //     //   }/account/account_created`,
  //     //   clientEmailTemplateContext: [
  //     //     {
  //     //       name: createdUser.employee_name,
  //     //     },
  //     //   ],
  //     //   clientContent: 'Your account has registered successfully!',
  //     //   reviewerId: [],
  //     //   reviewerEmail: [],
  //     //   reviewerContent: '',
  //     //   reviewerMobileNumber: [],
  //     //   reviwerSubject: '',
  //     //   createManyWebNotifPayload: createManyWebNotif,
  //     // };

  //     // await this.tenderNotifRepo.createMany(createManyWebNotif);

  //     // await this.notificationService.sendSmsAndEmailBatch(notifPayload);

  //     return {
  //       createdUser,
  //     };
  //   } catch (err) {
  //     if (err instanceof MsegatSendingMessageError) {
  //       throw new BadRequestException(
  //         `Request might be success but sms notif may not be sented to the client details ${err.message}`,
  //       );
  //     } else {
  //       this.logger.log(
  //         'info',
  //         `Falied to store user data on db, deleting the user ${idFromFusionAuth} from fusion auth`,
  //       );
  //       await this.fusionAuthService.fusionAuthDeleteUser(idFromFusionAuth);
  //       this.logger.log(
  //         'info',
  //         `deleting all uploaded files related for user ${idFromFusionAuth}`,
  //       );
  //       if (uploadedFilePath && uploadedFilePath.length > 0) {
  //         uploadedFilePath.forEach(async (path) => {
  //           await this.bunnyService.deleteMedia(path, true);
  //         });
  //       }
  //     }
  //     throw err;
  //   }
  // }

  async getMyProfile(userId: string) {
    const profile = await this.tenderClientRepository.findMyProfile(userId);
    if (!profile) throw new BadRequestException('Profile not found!');
    return profile;
  }

  async findMyPendingLogCount(user_id: string) {
    const total = await this.tenderClientRepository.countMyPendingLogs(user_id);
    return {
      dataCount: total,
    };
  }

  async uploadClientFile(
    userId: string,
    uploadMessage: string,
    file: TenderFilePayload,
    folderName: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 6,
    uploadedFilePath: string[],
    onCreateUser?: boolean | undefined,
  ) {
    try {
      const fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

      const filePath = `tmra/${this.appEnv}/organization/tender-management/client-data/${userId}/${folderName}/${fileName}`;

      const fileBuffer = Buffer.from(
        file.base64Data.replace(/^data:.*;base64,/, ''),
        'base64',
      );

      validateAllowedExtension(file.fileExtension, AllowedFileTypes);
      validateFileUploadSize(file.size, maxSize);

      const imageUrl = await this.bunnyService.oldUploadFileBase64(
        file.fullName,
        fileBuffer,
        filePath,
        `${uploadMessage} ${userId}`,
      );

      uploadedFilePath.push(imageUrl);
      const fileObj = {
        url: imageUrl,
        type: file.fileExtension,
        size: file.size,
      };

      return {
        uploadedFilePath,
        fileObj,
      };
    } catch (error) {
      if (uploadedFilePath.length > 0) {
        this.logger.info(
          `%j error, deleting all previous uploaded files: %j`,
          uploadMessage,
          error,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      if (onCreateUser && userId) {
        this.logger.info(
          `Falied to store user data on db, deleting the user %j from fusion auth`,
          userId,
        );
        await this.fusionAuthService.fusionAuthDeleteUser(userId);
      }
      const theError = prismaErrorThrower(
        error,
        TenderClientService.name,
        `${uploadMessage}, error:`,
        `${uploadMessage}`,
      );
      throw theError;
    }
  }

  sanitizeEditRequest(oldData: ClientEditRequestFieldDto) {
    delete oldData.created_banks;
    delete oldData.deleted_banks;
    delete oldData.updated_banks;
    delete oldData.old_banks;
    return oldData;
  }

  async findEditRequestByLogId(request_id: string) {
    const log = await this.tenderClientRepository.findEditRequestLogByRequestId(
      request_id,
    );
    if (!log) throw new NotFoundException('Edit Request Not Found!');

    const old_data = JSON.parse(log.old_value);
    const new_data = JSON.parse(log.new_value);

    const tmpDiffrence = ApproveEditRequestMapper(old_data, new_data);

    const diffrence = {
      ...tmpDiffrence.updateClientPayload,
    };

    if (old_data.bank_information && old_data.bank_information.length > 0) {
      /* loop the old bank */
      for (let i = 0; i < old_data.bank_information.length; i++) {
        /* loop the new_data.bank_information */
        if (new_data.bank_information && new_data.bank_information.length > 0) {
          /* find the old_data.bank_information[i] on the new_data.bank_information */
          const isExist = new_data.bank_information.findIndex(
            (value: bank_information) =>
              value.id === old_data.bank_information[i].id,
          );

          /* if it not exist mark it red*/
          if (isExist === -1) {
            old_data.bank_information[i].color = 'red';
          } else {
            /* if exist find in updatedBanks, if exist then mark it blue if not mark it transparent */
            if (new_data.updatedBanks && new_data.updatedBanks.length > 0) {
              const isExist = new_data.updatedBanks.findIndex(
                (value: bank_information) =>
                  value.id === old_data.bank_information[i].id,
              );
              isExist > -1
                ? (old_data.bank_information[i].color = 'blue')
                : (old_data.bank_information[i].color = 'transparent');
            }
          }
        }
      }
    }

    /* if new_data.bank_information is exist */
    if (new_data.bank_information && new_data.bank_information.length > 0) {
      for (let i = 0; i < new_data.bank_information.length; i++) {
        /* if there's an updated bank */
        if (new_data.updatedBanks && new_data.updatedBanks.length > 0) {
          const isExist = new_data.updatedBanks.findIndex(
            (value: bank_information) =>
              value.id === new_data.bank_information[i].id,
          );

          /* if the new_data.bank_information[i] exist in updated bank, mark it blue, if not mark it transparent*/
          isExist !== -1
            ? (new_data.bank_information[i]['color'] = 'blue')
            : (new_data.bank_information[i]['color'] = 'transparent');
        }

        /* if created bank is exist loop it */
        if (new_data.createdBanks && new_data.createdBanks.length > 0) {
          /* find new_data.bank_information[i] in created bank */
          const isExist = new_data.createdBanks.findIndex(
            (value: bank_information) =>
              value.id === new_data.bank_information[i].id,
          );
          /* if exist */
          if (isExist > -1) {
            /* then color it green */
            new_data.bank_information[i].color = 'green';
          }
        }
      }
    }

    // sanitize the new_data
    delete new_data.createdBanks;
    delete new_data.updatedBanks;
    delete new_data.deletedBanks;

    return {
      old_data,
      new_data,
      diffrence,
    };
  }

  async findClientProposalById(filter: SearchSpecificClientProposalFilter) {
    const proposals = await this.tenderClientRepository.findClientProposalById(
      filter,
    );
    return proposals;
  }

  async findClientProposals(request: SearchClientProposalFilter) {
    const response = await this.tenderClientRepository.findClientProposals(
      request,
    );
    if (response.length > 0) {
      return {
        data: response.map((res: any) => {
          return {
            id: res.id,
            employee_name: res.employee_name,
            mobile_number: res.mobile_number,
            email: res.email,
            governorate: res.governorate,
            status_id: res.status_id,
            proposal_count: Number(res.proposal_count),
          };
        }),
        total: Number(response[0].total_count),
      };
    } else {
      return {
        data: [],
        total: 0,
      };
    }
  }

  async findEditRequests(request: SearchEditRequestFilter) {
    const response = await this.tenderClientRepository.findEditRequests(
      request,
    );
    return response;
  }

  async sendResponseNotif(editRequest: RawResponseEditRequestDto['data']) {
    const {
      user,
      reviewer,
      status_id,
      rejected_at,
      reject_reason,
      accepted_at,
    } = editRequest;

    // console.log('edit request', editRequest);

    const rejectedTime = !!rejected_at
      ? moment(rejected_at).format('llll')
      : '';
    const approvedTime = !!accepted_at
      ? moment(accepted_at).format('llll')
      : '';

    const clientSubject = `Edit Request ${
      status_id === 'APPROVED' ? 'Approved' : 'Rejected'
    }`;
    const accManagersubject = `Change Edit Request Status Success!`;

    const msgSuffix =
      status_id === 'APPROVED'
        ? `at ${approvedTime}`
        : `, Details: ${reject_reason} at ${rejectedTime}`;

    const clientContent = `Your Edit Requet is ${
      status_id === 'APPROVED' ? 'Approved' : 'Rejected'
    } by The Account Manager ${
      reviewer ? '(' + reviewer.employee_name + ')' : ''
    } ${msgSuffix}`;

    const accManagerContent = `Your reponse is already applied (Changing edit request status from ${user.employee_name} to ${status_id}) ${msgSuffix}`;

    const baseSendEmail: Omit<SendEmailDto, 'to'> = {
      mailType: 'plain',
      from: 'no-reply@hcharity.org',
    };

    /* client ------------------------------------------------------------------------------------------------------------------------ */
    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      to: user.email,
      subject: clientSubject,
      content: clientContent,
    };
    this.emailService.sendMail(clientEmailNotif);

    const clientWebNotifPayload: CreateNotificationDto = {
      user_id: user.id,
      type: 'ACCOUNT',
      subject: clientSubject,
      content: clientContent,
    };
    await this.notificationService.create(clientWebNotifPayload);

    const clientPhone = isExistAndValidPhone(user.mobile_number);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: clientSubject + ', ' + clientContent,
      });
    }
    /* ----------------------------------------------------------------------------------------------------------------------------------- */

    if (reviewer) {
      const accManagerEmailNotif: SendEmailDto = {
        ...baseSendEmail,
        to: reviewer.email,
        subject: accManagersubject,
        content: accManagerContent,
      };
      this.emailService.sendMail(accManagerEmailNotif);

      const accManagerWebNotif: CreateNotificationDto = {
        user_id: reviewer.id,
        type: 'ACCOUNT',
        subject: accManagersubject,
        content: accManagerContent,
      };
      await this.notificationService.create(accManagerWebNotif);

      const accManagerPhone = isExistAndValidPhone(reviewer.mobile_number);
      if (accManagerPhone) {
        this.twilioService.sendSMS({
          body: accManagersubject + ', ' + accManagerContent,
          to: accManagerPhone,
        });
      }
    }
  }

  async sendEditRequestNotif(
    editRequest: RawCreateEditRequestResponse['data'],
  ) {
    const { user } = editRequest;
    const clientSubject = `New Edit Request Submitted Success!`;
    const accManagersubject = `New Edit Request Submitted Success!`;
    const clientContent = `Your edit request is submitted successfully!, please wait until account manager is reponded to your request`;
    const accManagerContent = `There's a new Edit Request from ${user.employee_name}`;

    const baseSendEmail: Omit<SendEmailDto, 'to'> = {
      mailType: 'plain',
      from: 'no-reply@hcharity.org',
    };

    /* the client on this proposal ------------------------------------------------------------------------------------------------ */
    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      to: user.email,
      subject: clientSubject,
      content: clientContent,
    };

    this.emailService.sendMail(clientEmailNotif);

    const clientWebNotifPayload: CreateNotificationDto = {
      user_id: user.id,
      type: 'ACCOUNT',
      subject: clientSubject,
      content: clientContent,
    };
    await this.notificationService.create(clientWebNotifPayload);

    const clientPhone = isExistAndValidPhone(user.mobile_number);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: clientSubject + ', ' + clientContent,
      });
    }
    /* ----------------------------------------------------------------------------------------------------------------------------------- */

    const accountManagers = await this.tenderUserRepository.findByRole(
      'ACCOUNTS_MANAGER',
    );
    if (accountManagers && accountManagers.length > 0) {
      for (let i = 0; i < accountManagers.length; i++) {
        const accManagerEmailNotif: SendEmailDto = {
          ...baseSendEmail,
          to: accountManagers[i].email,
          subject: accManagersubject,
          content: accManagerContent,
        };
        this.emailService.sendMail(accManagerEmailNotif);
        const accManagerWebNotif: CreateNotificationDto = {
          user_id: accountManagers[i].id,
          type: 'ACCOUNT',
          subject: accManagersubject,
          content: accManagerContent,
        };
        await this.notificationService.create(accManagerWebNotif);

        const accManagerPhone = isExistAndValidPhone(
          accountManagers[i].mobile_number,
        );

        if (accManagerPhone) {
          this.twilioService.sendSMS({
            body: accManagersubject + ', ' + accManagerContent,
            to: accManagerPhone,
          });
        }
      }
    }
  }
}
