import numeral from 'numeral';
import { TrackProps, TrackSection } from '../@types/commons';

// ----------------------------------------------------------------------

export function fCurrency(number: string | number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number: number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number: string | number) {
  return numeral(number).format();
}

export function fShortenNumber(number: string | number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number: string | number) {
  return numeral(number).format('0.0 b');
}

export function fCurrencyNumber(value: number) {
  const currencyOptions = {
    style: 'currency',
    currency: 'SAR',
    maximumSignificantDigits: 18,
  };

  return new Intl.NumberFormat('en-US', currencyOptions).format(value) as unknown as number;
}

export const arabicToAlphabetical = (input: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  let result = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const index = arabicNumbers.indexOf(char);

    if (index !== -1) {
      result += englishNumbers[index];
    } else {
      result += char;
    }
  }

  return result;
};

export const getSortingValue = (input: string): number => {
  if (input === '&sorting_field=project_name&sort=asc') {
    return 1;
  }
  if (input === '&sorting_field=project_name&sort=desc') {
    return 2;
  }
  if (input === '&sort=asc') {
    return 3;
  }
  if (input === '&sort=desc') {
    return 4;
  }
  return 0;
};

export function getChildRemainBudget(props: TrackSection) {
  const totalBudget = props?.budget || 0;
  const reservedBudget = props?.section_reserved_budget || 0;
  const spendingBudget = props?.section_spending_budget_by_ceo || 0;
  return totalBudget - (reservedBudget + (spendingBudget - reservedBudget));
}

export function getChildSpendingBudget(props: TrackSection) {
  const reservedBudget = props?.section_reserved_budget || 0;
  const spendingBudget = props?.section_spending_budget_by_ceo || 0;
  return spendingBudget - reservedBudget;
}

export function getTrackRemainBudget(props: TrackProps) {
  const totalBudget = props?.total_budget || 0;
  const reservedBudget = props?.total_reserved_budget || 0;
  const spendingBudget = props?.total_spending_budget_by_ceo || 0;
  return totalBudget - (reservedBudget + (spendingBudget - reservedBudget));
}

export function getTrackSpendingBudget(props: TrackProps) {
  const reservedBudget = props?.total_reserved_budget || 0;
  const spendingBudget = props?.total_spending_budget_by_ceo || 0;
  return spendingBudget - reservedBudget;
}
