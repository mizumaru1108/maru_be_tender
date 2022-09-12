import { ZakatPartitions } from './zakat-partitions.schema';

/**
 * not using doc type nor schema (it will be used as a type also a validator)
 */
export class ZakatDetails {
  /**
   * should be filled with UUID (for query purposes)
   */
  zakatDetailId: string;

  /**
   * could be silver, gold, cash, etc (could be enum, so people can't input anything)
   */
  type: string;

  /**
   * could be gram, kg, etc
   */
  unit: string;

  /**
   * not a quantity, but in terms (SAHAM)
   */
  numberOfStocks: number;

  /**
   * amount of donation
   */
  amount: number;

  /**
   * SUM of numberOfStocks * amount
   */
  totalAmount: number;

  /**
   * partitions (ex: 50 gram gold, 30 gram is 18 carat, and 20 gram is 24 carat)
   */
  partitions: ZakatPartitions[];
}
