/**
 * Data Transfer Object for sending LoginResponse.
 */
export class LoginResponseDto {
  /**
   * User access token.
   */
  accessToken: string;

  /**
   * User Data.
   */
  user: any;
}
