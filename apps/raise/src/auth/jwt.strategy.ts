import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FusionAuthClient, { LoginResponse } from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate(payload: ClientResponse<LoginResponse>) {
    // console.log(payload.sub);
    // return { userId: payload.sub };
    const fusionauth = new FusionAuthClient(
      this.configService.get('FUSIONAUTH_CLIENT_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
    const validToken = await fusionauth.validateJWT(payload.response.token!);
    if (!validToken) {
      throw new HttpException('Invalid Signature!', 401);
    }
    return await fusionauth.retrieveUserUsingJWT(payload.response.token!);
  }
}
