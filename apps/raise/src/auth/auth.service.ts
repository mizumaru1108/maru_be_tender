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
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async useFusionAuth() {
    return new FusionAuthClient(
      this.configService.get('FUSIONAUTH_CLIENT_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
  }

  async loginUser(loginRequest: LoginRequestDto) {
    loginRequest.applicationId = this.configService.get<string>(
      'FUSIONAUTH_APP_ID',
      '',
    );
    try {
      const fusionauth = new FusionAuthClient(
        this.configService.get('FUSIONAUTH_CLIENT_KEY', ''),
        this.configService.get('FUSIONAUTH_URL', ''),
        this.configService.get('FUSIONAUTH_TENANT_ID', ''),
      );
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
  // async loginUser(email: string, password: string) {
  //   let isValid = false;

  //   const user = await this.usersService.getOneUser({ email });

  //   if (user && user.password === password) isValid = true;

  //   if (!isValid) {
  //     throw new HttpException('Invalid login details', 401);
  //   }

  //   return {
  //     user: {
  //       id: user?.id,
  //       name: user?.name,
  //       email: user?.email,
  //     },
  //     accessToken: this.generateToken(user)
  //   }
  // }

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
