import { Types } from 'mongoose';
import { RegisterOrganizationDto } from 'src/auth/dtos/register-organization.dto';
import { AuthzedRelationship } from 'src/libs/authzed/enums/relationship.enum';

export function CreateNewOrganizationMappers(
  request: RegisterOrganizationDto,
  imgBunny: string,
) {
  const organizationData = {
    _id: new Types.ObjectId().toString(),
    id: new Types.ObjectId().toString(),
    ownerUserId: request.ownerUserId!,
    ownerRealmId: new Types.ObjectId(),
    name: request.organizationName!,
    username: request.organizationName!,
    defaultCurrency: request.useCurrency!,
    organizationEmail: request.email,
    contactEmail: request.email,
    contactPhone: request.phone!,
    isoPhoneCode: '',
    country: request.country!,
    state: request.state!,
    city: request.locationOrganization!,
    address: request.address!,
    zipCode: '',
    aboutHeading: request.organizationMission!,
    aboutBody: '',
    aboutPicture: imgBunny,
    instagram: '',
    facebook: '',
    twitter: '',
    contactWhatsapp: '',
    favicon: imgBunny,
    latitude: '',
    longitude: '',
    currencyOptions: request.useCurrency! ? [request.useCurrency!] : [],
    defaultLanguage: 'en-US',
    campaignLanguage: 'en-US',
    selectedLanguage: ['en-US'],
    zakatTransaction: false,
    zakatCalculator: false,
    organizationType: AuthzedRelationship.NONPROFIT,
  };

  return { ...organizationData };
}
