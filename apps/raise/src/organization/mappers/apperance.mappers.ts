import { Types } from 'mongoose';

interface RequestMapperAppearance {
  orgId: string;
  ownerUserId: string;
  ownerRealmId: string;
  logo: string;
}

export function CreateNewAppearance(request: RequestMapperAppearance) {
  const appearanceData = {
    _id: new Types.ObjectId(request.orgId),
    id: new Types.ObjectId().toString(),
    ownerUserId: request.ownerUserId,
    ownerRealmId: request.ownerRealmId,
    primaryColor: randomHexColor(),
    secondaryColor: randomHexColor(),
    detailStory1: '',
    detailStory2: '',
    detailStory3: '',
    videoUrl: '',
    whySupportUs1: '',
    whySupportUs2: '',
    whySupportUs3: '',
    logo: request.logo,
    ourStory: '',
    peopleSay: '',
    whyShouldWe: '',
    accent: randomHexColor(),
    headerAndFooter: randomHexColor(),
    lButton: randomHexColor(),
    themesColor: randomHexColor(),
    usePallete: false,
    lText: randomHexColor(),
    eventImagesUrl1:
      'https://media.tmra.io/tmra/production/giving-sadaqah-62414373cf00cca3a830814a-XyCN.jpg',
    eventImagesUrl2: '',
    eventImagesUrl3: '',
    mainImageUrl:
      'https://media.tmra.io/tmra/production/giving-sadaqah-62414373cf00cca3a830814a-XyCN.jpg',
    secondaryImage:
      'https://media.tmra.io/tmra/production/giving-sadaqah-62414373cf00cca3a830814a-XyCN.jpg',
    favIcon: request.logo,
  };

  return appearanceData;
}

export function randomHexColor() {
  const listColor = [
    '#f44336',
    '#e91e63',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#00bcd4',
    '#009688',
    '#00AA55',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#795548',
    '#9e9e9e',
    '#607d8b',
  ];
  const randomIndex = Math.floor(Math.random() * listColor.length);

  return listColor[randomIndex];
}
