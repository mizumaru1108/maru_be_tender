class Rate {
  readonly type: string;
  readonly price: string;
}

export class CreateMetalPriceDto {
  readonly id: string;
  readonly metalType: string;
  readonly currency: string;
  readonly rates: Rate;
  readonly unit: string;
  readonly createdDate: string;
  readonly isActive: boolean;
}
