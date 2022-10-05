import { BadRequestException, ConsoleLogger, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';
import { rootLogger } from 'src/logger';
import { UserService } from 'src/user/user.service';
import { EmailService } from '../libs/email/email.service';
import { FusionAuthService } from '../libs/fusionauth/services/fusion-auth.service';
import { User } from '../user/schema/user.schema';
import { LoginRequestDto, RegisterRequestDto, RegisterTendersDto, RegReqTenderDto } from './dtos';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private logger = rootLogger.child({ logger: AuthService.name });
  constructor(
    private readonly usersService: UserService,
    private readonly emailService: EmailService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async fusionLogin(loginRequest: LoginRequestDto) {
    const loginResponse = await this.fusionAuthService.fusionAuthLogin(
      loginRequest,
    );
    const response = {
      user: {
        id: loginResponse.response.user!.id!,
        email: loginResponse.response.user!.email!,
      },
      accessToken: loginResponse.response.token!,
    };
    return response;
  }

  async fusionRegister(registerRequest: RegisterRequestDto): Promise<User> {
    const result = await this.fusionAuthService.fusionAuthRegister(
      registerRequest,
    );
    const registeredUser = await this.usersService.registerFromFusion({
      _id: result.user.id,
      firstname: result.user.firstName,
      lastname: result.user.lastName,
      email: result.user.email,
      country: result.user.country,
      state: result.user.state,
      address: result.user.address,
      mobile: result.user.mobile,
    });

    const gsOrgId = '62414373cf00cca3a830814a';
    const omarOrgId = '61b4794cfe52d41f557f1acc';

    //!TODO: change banner url, maybe implements with .env letter
    const gsBannerImageUrl =
      'https://media.tmra.io/tmra/production/giving-sadaqah-62414373cf00cca3a830814a-DVed.png';
    const omarBannerImageUrl =
      'https://media.tmra.io/tmra/production/giving-sadaqah-62414373cf00cca3a830814a-DVed.png';

    let banner: string;
    let orgName: string;
    if (registerRequest.organizationId === gsOrgId) {
      banner = gsBannerImageUrl;
      orgName = 'Giving Sadaqah';
    } else if (registerRequest.organizationId === omarOrgId) {
      banner = omarBannerImageUrl;
      orgName = 'Omar';
    } else {
      throw new BadRequestException("Organization doesn't exist");
    }

    //!TODO: create hbs template for email
    const isSend = await this.emailService.sendMailWTemplate(
      // 'rdanang.dev@gmail.com', // change to your email to test, ex: rdanang.dev@gmail.com, default value is registeredUser.email
      registeredUser.email, // change to your email to test, ex: rdanang.dev@gmail.com, default value is registeredUser.email
      `Welcome to ${orgName}!`,
      'user/valiate-email',
      {
        fullName: registeredUser.firstname + ' ' + registeredUser.lastname,
        email: registeredUser.email,
        banner,
        orgName,
      },
      'hello@tmra.io', // we can make it dynamic when new aws ses identity available
    );
    if (!isSend) {
      throw new BadRequestException('An error occured while sending email');
    }
    return registeredUser;
  }

  async fusionRegTender(registerRequest: RegReqTenderDto) {
    const result = await this.fusionAuthService.fusionAuthRegTender(
      registerRequest,
    );
    const registeredUser = await this.usersService.regFromFusionTender({
      id: result.user.id,
      employee_name: result.user.firstName,
      email: result.user.email,
      mobile_number: result.user.mobilePhone,
      user_type_id: registerRequest.user_type_id,
      is_active: registerRequest.is_active,
      employees_permissions: registerRequest.employees_permissions
    });
    return registeredUser;
  }

  async fusionRegisterTender(registerRequest: RegisterTendersDto) {
    const dataRegister = JSON.stringify(registerRequest.data);
    const dtReg = JSON.parse(dataRegister);
    const emailData = await this.prisma.user.findUnique({
      where: { email: dtReg[0].email }
    });

    if (emailData) {
      throw new HttpException('Email already exist', 400);
    }
    const licenseNumber = await this.prisma.client_data.findFirst({
      where: {
        OR: [
          {
            license_number: {
              equals: dtReg[0].license_number
            }
          },
          {
            id: {
              equals: dtReg[0].id
            }
          },
        ]
      }
    });

    if (licenseNumber) {
      throw new HttpException('license Number or id already exist', 400);
    }

    const result = await this.fusionAuthService.fusionAuthRegisterTender(
      registerRequest,
    );

    let registeredUser;
    try {
      if (result && result.user.id) {
        registeredUser = await this.usersService.registerFromFusionTender({
          id_: result.user.id,
          id: dtReg[0].id,
          authority: dtReg[0].authority,
          board_ofdec_file: dtReg[0].board_ofdec_file,
          center_administration: dtReg[0].center_administration,
          ceo_mobile: dtReg[0].ceo_mobile,
          ceo_name: dtReg[0].ceo_name,
          data_entry_mail: dtReg[0].data_entry_mail,
          data_entry_mobile: dtReg[0].data_entry_mobile,
          email: dtReg[0].email,
          employee_name: dtReg[0].employee_name,
          employee_path: dtReg[0].employee_path,
          entity: dtReg[0].entity,
          entity_mobile: dtReg[0].entity_mobile,
          governorate: dtReg[0].governorate,
          headquarters: dtReg[0].headquarters,
          license_expired: moment(dtReg[0].license_expired).toISOString(), // Date
          license_file: dtReg[0].license_file,
          license_issue_date: moment(dtReg[0].license_issue_date).toISOString(), // Date
          license_number: dtReg[0].license_number,
          num_of_beneficiaries: dtReg[0].num_of_beneficiaries,
          num_of_employed_facility: dtReg[0].num_of_employed_facility,
          data_entry_name: dtReg[0].data_entry_name,
          date_of_esthablistmen: moment(dtReg[0].date_of_esthablistmen).toISOString(),// Date
          password: "",
          phone: dtReg[0].phone,
          region: dtReg[0].region,
          status: dtReg[0].status,
          twitter_acount: dtReg[0].twitter_acount,
          website: dtReg[0].website,
          mobile_data_entry: dtReg[0].mobile_data_entry,
          bank_informations: dtReg[0].bank_informations
        });
        return registeredUser;
      } else {
        return {
          messageCode: 400,
          message: 'An error occured while sending data',
        }
      }
    } catch (error) {
      console.log('error', error)
      console.log('error=', error.response)
      return {
        messageCode: 400,
        message: error.response,
      }
    }
  }

  async registerUser(name: string, email: string, password: string) {
    const user = await this.usersService.getOneUser({ email });

    if (user) {
      throw new HttpException(
        'A user account with that email already exists',
        409,
      );
    }

    try {
      const newUser = await this.usersService.createUser(name, email, password);

      return {
        user: {
          id: newUser._id,
          name: newUser?.name,
          email: newUser?.email,
        },
        accessToken: this.generateToken(newUser),
      };
    } catch (error) {
      throw new HttpException('An error occured while registering user', 500);
    }
  }

  generateToken(user: any) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
      }),
    };
  }
}
