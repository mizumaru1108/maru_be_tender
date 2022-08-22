import FusionAuthClient, {
  LoginResponse,
  ValidateResponse,
} from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { FusionAuthService } from '../libs/fusionauth/services/fusion-auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private fusionAuthService: FusionAuthService,
  ) {}

  async loginUser(loginRequest: LoginRequestDto) {
    loginRequest.applicationId = this.configService.get<string>(
      'FUSIONAUTH_APP_ID',
      '',
    );
    try {
      const fusionauth = await this.fusionAuthService.useFusionAuthClient();
      const result: ClientResponse<LoginResponse> = await fusionauth.login(
        loginRequest,
      );

      const response = {
        user: {
          id: result.response.user!.id,
          email: result.response.user!.email,
        },
        accessToken: result.response.token!,
      };
      return response;
    } catch (error) {
      if (error.statusCode < 500) {
        throw new UnauthorizedException('Invalid credentials!');
      } else {
        throw new Error('Something went wrong!');
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
