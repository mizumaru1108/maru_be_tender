import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { Credentials } from 'google-auth-library';
import { GoogleOAuth2Service } from '../../libs/google-oauth2/google-oauth2.service';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';

/**
 * @author RDananag (iyoy)
 * Danangs Note:
 * 1. password or nestjs password didnt work well with Fasitfy, so i made this guard.
 * 2. To be noted, this guard is only for google oauth2
 * 3. this guard should be used together with TenderJwtGuard (to get the current user) [src/tender-auth/guards/tender-jwt.guard.ts]
 */
@Injectable()
export class GoogleOAuth2CalendarGuard implements CanActivate {
  // only use global module for this guard for mobility and reusability
  constructor(
    private googleOAuth2Service: GoogleOAuth2Service,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authCode = request.body.authCode;

    // it should be filled, take the note, this guard should be combined TenderAuthGuard
    const tenderUser: TenderCurrentUser = {
      ...request.user,
    };

    const user: user = await this.findUser(tenderUser.id); // get the user from db

    // for renew the refresh token
    const updateUserGoogleSession = async (
      userId: string,
      creds: Credentials,
    ) => {
      const updatedUser = await this.updateUser(userId, {
        google_session: {
          refresh_token: creds.refresh_token,
          access_token: creds.access_token,
          expiry_date: creds.expiry_date,
        },
      });
      tenderUser.googleSession = updatedUser.google_session as {
        refresh_token: string;
        access_token: string;
        expiry_date: number;
      };
      request.user = tenderUser;
    };

    // for deleting the google session (set google session to empty object)
    const deleteGoogleSession = async (userId: string) => {
      await this.updateUser(userId, {
        google_session: {},
      });
      tenderUser.googleSession = undefined;
      request.user = tenderUser;
    };

    // if there is no google session on the current user and there's no auth code
    if (!user.google_session && !authCode) {
      // console.log("no google session and no auth code, let's login first");
      const authUrl = await this.googleOAuth2Service.getLoginUrl(
        [
          'profile', // get the user's profile
          'https://www.googleapis.com/auth/calendar', // get the user's calendar
          'https://www.googleapis.com/auth/calendar.events', // for calendar events (create)
        ],
        'tender',
        '/tender-appointment/google-callback',
      );
      throw new UnauthorizedException(
        `You need to login to google first!, please go to this url: ${authUrl}`,
      );
    }

    //if there's no google session on the current user and there's auth code attached on request.body
    if (!user.google_session && authCode) {
      // console.log(`no google session but there is auth code ${authCode}`);
      const result = await this.googleOAuth2Service.getNewRefreshToken(
        authCode,
      );
      await updateUserGoogleSession(user.id, result);
      return true;
    }

    // if there's google session on the current user
    if (user.google_session) {
      // if user.google_session has refresh_token, access_token, and expiry_date  properties (not an empty object)
      if (
        user.google_session.hasOwnProperty('refresh_token') &&
        user.google_session.hasOwnProperty('access_token') &&
        user.google_session.hasOwnProperty('expiry_date')
      ) {
        const userGoogleSession = user.google_session as {
          refresh_token: string;
          access_token: string;
          expiry_date: number;
        };

        // if the token is not expired yet
        if (userGoogleSession.expiry_date > new Date().getTime()) {
          // console.log('token is not expired yet, renewing the token');
          // renew the token
          const newToken = await this.googleOAuth2Service.renewRefreshToken(
            userGoogleSession,
          );
          await updateUserGoogleSession(user.id, newToken);
          return true;
        } else {
          // if the token is expired (expiry_date < now)
          // console.log('token is expired, deleting the session');
          await deleteGoogleSession(user.id);
          const authUrl = await this.googleOAuth2Service.getLoginUrl(
            [
              'profile', // get the user's profile
              'https://www.googleapis.com/auth/calendar', // get the user's calendar
              'https://www.googleapis.com/auth/calendar.events', // for calendar events (create)
            ],
            'tender',
            '/tender-appointment/google-callback',
          );
          throw new UnauthorizedException(
            `Your session is expired!, please re-login go to this url: ${authUrl}`,
          );
        }
      } else {
        // if google session is empty object and there's auth code
        if (authCode) {
          // console.log("google session is empty object and there's auth code");
          const result = await this.googleOAuth2Service.getNewRefreshToken(
            authCode,
          );
          await updateUserGoogleSession(user.id, result);
          return true;
        } else {
          // if google session is empty object and there's no auth code
          // console.log(
          //   "google session is empty object and there's no auth code",
          // );
          const authUrl = await this.googleOAuth2Service.getLoginUrl(
            [
              'profile', // get the user's profile
              'https://www.googleapis.com/auth/calendar', // get the user's calendar
              'https://www.googleapis.com/auth/calendar.events', // for calendar events (create)
            ],
            'tender',
            '/tender-appointment/google-callback',
          );
          throw new UnauthorizedException(
            `Your session is expired!, please go to this url: ${authUrl}`,
          );
        }
      }
    }
    return true;
  }

  async findUser(userId: string): Promise<user> {
    try {
      const user = await this.prismaService.user.findFirstOrThrow({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('User not found!');
      }
      return user;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        'GoogleOAuth2Guard',
        'GoogleOAuth2Guard error:',
        `finding user!`,
      );
      throw theError;
    }
  }

  // forced to rewrite this to this to avoid circular dependency
  async updateUser(
    userId: string,
    userData: Prisma.userUpdateInput | Prisma.userUncheckedUpdateInput,
  ): Promise<user> {
    try {
      return await this.prismaService.user.update({
        where: { id: userId },
        data: userData,
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        'GoogleOAuth2Guard',
        'GoogleOAuth2Guard error:',
        `updating user!`,
      );
      throw theError;
    }
  }
}
