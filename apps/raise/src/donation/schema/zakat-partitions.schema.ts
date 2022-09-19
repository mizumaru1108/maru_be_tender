/**
 * not using doc type nor schema (it will be used as a type also a validator)
 */
export class ZakatPartitions {
  /**
   * should be filled with UUID (for query purposes)
   */
  zakatPartitionId: string;

  carat: number;

  unitPrice?: number;

  numberOfUnit: number;

  amount: number;
}
