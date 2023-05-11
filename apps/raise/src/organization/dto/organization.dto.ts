export class OrganizationDto {
  organizationEmail: string;
  name: string;
  address: string;
  contactPhone: string;
  aboutHeading: string;
  aboutBody: string;
  aboutPicture: string;
  isoPhoneCode: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  instagram: string;
  facebook: string;
  twitter: string;
  contactWhatsapp: string;
  latitude: string;
  longitude: string;
  currencyOptions: object;
  defaultLanguage: string;
  campaignLanguage: string;
  selectedLanguage: string[] | [];
  zakatTransaction: boolean;
  zakatCalculator: boolean;
}
