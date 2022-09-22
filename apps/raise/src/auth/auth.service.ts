import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { EmailService } from '../libs/email/email.service';
import { FusionAuthService } from '../libs/fusionauth/services/fusion-auth.service';
import { User } from '../user/schema/user.schema';
import { LoginRequestDto, RegisterRequestDto, RegReqTenderDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly emailService: EmailService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly jwtService: JwtService,
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
      mobile_number: result.user.mobile,
      user_type_id: registerRequest.user_type_id
    });


    return registeredUser;
    // return 'registeredUser';
  }
  async fusionRegisterTender(registerRequest: RegReqTenderDto) {
    const result = await this.fusionAuthService.fusionAuthRegTender(
      registerRequest,
    );

    return {
      statusCode: 201,
      message: "Create User Success!",
      id: result.user.id
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
