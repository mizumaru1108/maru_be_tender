import { User } from '@fusionauth/typescript-client';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ROOT_LOGGER } from 'src/libs/root-logger';
import { UserService } from 'src/user/user.service';
import { SendEmailDto } from '../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../libs/email/email.service';
import { FusionAuthService } from '../../libs/fusionauth/services/fusion-auth.service';
import { GoogleOAuth2Service } from '../../libs/google-oauth2/google-oauth2.service';
import { LoginRequestDto, RegisterRequestDto } from '../dtos';

@Injectable()
export class AuthService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': AuthService.name,
  });
  constructor(
    private readonly usersService: UserService,
    private readonly emailService: EmailService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly jwtService: JwtService,
    private readonly googleOAuth2Service: GoogleOAuth2Service,
  ) {}

  async googleLogin() {
    return await this.googleOAuth2Service.getLoginUrl(
      ['profile', 'email'],
      'tmra',
    );
  }

  async handleGoogleCallback(code: string) {
    /* validate user token, exchange into google refresh token, also set oauth2 creds using that token */
    const token = await this.googleOAuth2Service.getNewRefreshToken(code);
    // console.log('token', token);

    /* get user info using current oauth2 creds  */
    const googleUser = await this.googleOAuth2Service.getUserInfo(token);
    // console.log('googleUser.data', googleUser.data);

    /*  login by email(from google) on fusion auth (fusion auth passwordless login) */
    const loginCode =
      await this.fusionAuthService.fusionAuthPasswordlessLoginStart(
        googleUser.data.email,
      );

    /* if the user exist on fusion auth */
    if (typeof loginCode !== 'number') {
      // console.log('loginCode', loginCode);

      /* login with email result (get jwt token) */
      const loginResponse =
        await this.fusionAuthService.fusionAuthPasswordlessLogin(loginCode);
      // console.log('login Response: ', loginResponse);

      /* return the jwt token */
      return loginResponse;
    }

    /* usert not exist on fusion auth */
    if (loginCode === 404) {
    }
    return googleUser;
  }

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

    const sendEmailParam: SendEmailDto = {
      to: registeredUser.email, // change to your email to test, ex: rdanang.dev@gmail.com, default value is registeredUser.email
      subject: 'email verification',
      mailType: 'template',
      templatePath: 'user/valiate-email',
      templateContext: {
        fullName: registeredUser.firstname + ' ' + registeredUser.lastname,
        email: registeredUser.email,
        banner: banner,
        orgName: orgName,
      },
      from: 'hello@tmra.io', // we can make it dynamic when new AWS SESW identity available
    };

    const isSend = await this.emailService.sendMail(sendEmailParam);
    if (!isSend) {
      throw new BadRequestException('An error occured while sending email');
    }
    return registeredUser;
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
