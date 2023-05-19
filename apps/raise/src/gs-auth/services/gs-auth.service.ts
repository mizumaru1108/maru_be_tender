import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { CommonNotificationMapperResponse } from 'src/tender-commons/dto/common-notification-mapper-response.dto';
import { LoginRequestDto } from '../../auth/dtos';
import { GsUserService } from '../../gs-user/services/gs-user.service';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import {
  GSRegisterRequestDto,
  GSVerifyUser,
  GSResetPassword,
} from '../dtos/requests/gs-register-request.dto';
import { TenderNotificationService } from 'src/tender-notification/services/tender-notification.service';
import {
  Organization,
  OrganizationDocument,
} from 'src/organization/schema/organization.schema';
import { Model, Types } from 'mongoose';
import { SubmitChangePasswordDto } from 'src/tender-auth/dtos/requests/submit-change-password.dto';

@Injectable()
export class GsAuthService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private readonly fusionAuthService: FusionAuthService,
    private readonly gsUserService: GsUserService,
    private readonly notificationService: TenderNotificationService,
  ) {}

  async login(loginRequest: LoginRequestDto) {
    const fusionRes = await this.fusionAuthService.fusionAuthLogin(
      loginRequest,
    );
    if (!fusionRes || !fusionRes.response.user || !fusionRes.response.user.id) {
      throw new BadRequestException('Failed to fetch user!');
    }
    const user = await this.gsUserService.findUserById(
      fusionRes.response.user.id,
    );
    return {
      fusionAuthRes: fusionRes,
      user: user,
    };
  }

  async register(registerRequest: GSRegisterRequestDto) {
    const fusionAuthRes = await this.fusionAuthService.fusionAuthRegister(
      registerRequest,
    );

    if (!fusionAuthRes || !fusionAuthRes.user || !fusionAuthRes.user.id) {
      throw new BadRequestException('Failed to fetch user!');
    }

    const registeredUser = await this.gsUserService.registerFromFusion({
      _id: fusionAuthRes.user.id,
      firstname: fusionAuthRes.user.firstName,
      lastname: fusionAuthRes.user.lastName,
      email: fusionAuthRes.user.email,
      country: registerRequest.country,
      state: registerRequest.state,
      address: registerRequest.address,
      mobile: registerRequest.mobile,
      organizationId: registerRequest.organizationId,
    });

    const verifyEmail = await this.fusionAuthService.requestVerify({
      email: fusionAuthRes.user.email,
      fullName: `${registerRequest.firstName} ${registerRequest.lastName}`,
      userId: fusionAuthRes.user.id,
      organizationId: registerRequest.organizationId,
      organizationEmail: registerRequest.organizationEmail,
      domainUrl: registerRequest.domainUrl,
    });

    return {
      user: registeredUser,
      verificationId: verifyEmail?.user_id,
      url: registerRequest.domainUrl,
      token: fusionAuthRes.token,
      refreshToken: fusionAuthRes.refreshToken,
    };
  }

  async verifyUser(verifyPayload: GSVerifyUser) {
    const fusionCheckUser = await this.fusionAuthService.fusionUserCheck(
      verifyPayload,
    );

    const organizationData = await this.organizationModel.findOne({
      _id: new Types.ObjectId(verifyPayload.organization_id),
    });

    if (!organizationData) {
      throw new HttpException('Organization not found!', HttpStatus.NOT_FOUND);
    }

    try {
      if (fusionCheckUser.user?.verified) {
        const notifPayload: CommonNotificationMapperResponse = {
          logTime: moment(new Date().getTime()).format('llll'),
          generalHostEmail: 'tmra',
          clientSubject: 'Welcome to Giving Sadaqah',
          clientId: [],
          clientEmail: [fusionCheckUser.user.email!],
          clientMobileNumber: [],
          clientEmailTemplatePath: `gs/en/register/success_donor_verify`,
          clientEmailTemplateContext: [
            {
              donor_email: fusionCheckUser.user.email,
              donor_name: fusionCheckUser.user.firstName,
              donor_redirect_link: `${verifyPayload.domain_url}/user/login`,
            },
          ],
          clientContent:
            "We're excited to welcome you to Giving Sadaqah and we're even more excited about what we've got planned.",
          reviewerId: [],
          reviewerEmail: [organizationData.contactEmail],
          reviewerContent: 'There is a new donor that you should check!',
          reviewerMobileNumber: [],
          reviwerSubject:
            'Donor has sent you an Email! Please check your inbox...`',
          reviewerEmailTemplatePath: `gs/en/register/new_donor_organization`,
          reviewerEmailTemplateContext: [
            {
              donor_email: fusionCheckUser.user.email,
              donor_name: fusionCheckUser.user.firstName,
            },
          ],
          createManyWebNotifPayload: [],
        };

        await this.notificationService.sendSmsAndEmailBatch(notifPayload);

        return fusionCheckUser.user;
      }
    } catch (error) {
      throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
    }
  }

  async resetPasswordUser(resetPayload: GSResetPassword) {
    const organizationData = await this.organizationModel.findOne({
      _id: new Types.ObjectId(resetPayload.organization_id),
    });

    if (!organizationData) {
      throw new HttpException('Organization not found!', HttpStatus.NOT_FOUND);
    }

    const retrieveFusionUser =
      await this.fusionAuthService.fusionUserCheckByEmail(resetPayload.email);

    const fusionResetPassword =
      await this.fusionAuthService.forgotPasswordRequest(resetPayload.email);

    try {
      if (retrieveFusionUser && fusionResetPassword) {
        const notifPayload: CommonNotificationMapperResponse = {
          logTime: moment(new Date().getTime()).format('llll'),
          generalHostEmail: 'tmra',
          clientSubject: 'Password reset instructions',
          clientId: [],
          clientEmail: [retrieveFusionUser.user?.email!],
          clientMobileNumber: [],
          clientEmailTemplatePath: `gs/en/reset/reset_password`,
          clientEmailTemplateContext: [
            {
              user_name: `${retrieveFusionUser.user?.firstName ?? ''} ${
                retrieveFusionUser.user?.lastName ?? ''
              }`,
              redirect_link: `${resetPayload.domain_url}/user/reset-password/${fusionResetPassword}/change-password`,
            },
          ],
          clientContent:
            'A request to reset your Giving Sadaqah password has been made.',
          reviewerId: [],
          reviewerEmail: [organizationData.contactEmail],
          reviewerContent:
            'There is a new reset password donor that you should check!',
          reviewerMobileNumber: [],
          reviwerSubject: 'Donor has made a request reset password...',
          // reviewerEmailTemplatePath: `gs/en/register/new_donor_organization`,
          // reviewerEmailTemplateContext: [
          //   {
          //     donor_email: fusionCheckUser.user.email,
          //     donor_name: fusionCheckUser.user.firstName,
          //   },
          // ],
          createManyWebNotifPayload: [],
        };

        await this.notificationService.sendSmsAndEmailBatch(notifPayload);
      }

      return { change_password_id: fusionResetPassword };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_GATEWAY);
    }
  }

  async submitChangePassword(request: SubmitChangePasswordDto) {
    await this.fusionAuthService.submitChangePassword(
      request.changePasswordId,
      request.newPassword,
      request.oldPassword,
    );
  }
}
