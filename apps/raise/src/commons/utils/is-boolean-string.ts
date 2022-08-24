import { BaseBooleanString } from '../enums/base-boolean-string.enum';
import { BooleanString } from '../enums/boolean-string.enum';

export async function isBooleanStringY(value: string): Promise<boolean> {
  if (
    value === BooleanString.y ||
    value === BaseBooleanString.Y ||
    value === BooleanString.yes ||
    value === BooleanString.Yes ||
    value === BooleanString.YES
  ) {
    return true;
  }
  return false;
}

export async function isBooleanStringN(value: string): Promise<boolean> {
  if (
    value === BooleanString.n ||
    value === BaseBooleanString.N ||
    value === BooleanString.no ||
    value === BooleanString.No ||
    value === BooleanString.NO
  ) {
    return true;
  }
  return false;
}
