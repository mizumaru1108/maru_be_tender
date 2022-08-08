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

@Injectable()
export class FusionAuthService {
  constructor(private configService: ConfigService) {}

  async useFusionAuthClient() {
    return new FusionAuthClient(
      this.configService.get('FUSIONAUTH_CLIENT_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
  }

  async useFusionAuthAdminClient() {
    return new FusionAuthClient(
      this.configService.get('FUSIONAUTH_ADMIN_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
  }
}
