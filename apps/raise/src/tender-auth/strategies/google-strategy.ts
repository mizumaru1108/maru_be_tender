import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('GAPI_CLIENT_ID')!,
      clientSecret: configService.get('GAPI_CLIENT_SECRET')!,
      callbackURL: 'http://localhost:3000/tender-appointment/google-callback',
      scope: ['email', 'profile'],
      // 'https://www.googleapis.com/auth/calendar',
      // 'https://www.googleapis.com/auth/calendar.events',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    // return { accessToken, refreshToken, profile };
  }
}
