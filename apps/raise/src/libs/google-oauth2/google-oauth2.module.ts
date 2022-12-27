import { Module, Global } from '@nestjs/common';
import { GoogleOAuth2Controller } from './google-oauth2.controller';
import { GoogleOAuth2Service } from './google-oauth2.service';

@Global()
@Module({
  controllers: [GoogleOAuth2Controller],
  providers: [GoogleOAuth2Service],
  exports: [GoogleOAuth2Service],
})
export class GoogleOAuth2Module {}
