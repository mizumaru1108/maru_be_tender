export declare type UUID = string;

export interface ValidateJwtResponse {
  statusCode: number;
  jwt?: {
    aud: string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    sub: string;
    applicationId: string;
    auth_time: number;
    authenticationType: string;
    email: string;
    email_verified: boolean;
    roles: string[];
    tid: string;
  };
}

export interface IVerifyEmailDto {
  email: string;
  fullName?: string;
  domainUrl?: string;
  organizationId?: string;
  organizationEmail?: string;
  verificationId?: string;
  userId: UUID;
}

export interface ISendNewOrganization {
  email: string;
  organization_name: string;
  domainUrl: string;
}

export interface IUserVerifyCheck {
  user_id: UUID;
  domain_url: string;
}

export interface IQueryAxiosVerify {
  applicationId: string;
  email: string;
}
