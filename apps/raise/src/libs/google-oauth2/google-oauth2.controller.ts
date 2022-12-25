import { Controller } from '@nestjs/common';
import { GoogleOAuth2Service } from './google-oauth2.service';

@Controller('google-calendar')
export class GoogleOAuth2Controller {
  constructor(private readonly googleOAuth2Service: GoogleOAuth2Service) {}
}
