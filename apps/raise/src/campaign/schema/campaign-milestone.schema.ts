/**
 * not using doc type nor schema (it will be used as a type also a validator)
 */
export class CampaignMilestone {
  /**
   * milestoneId (why?, for make it easied to query)
   */
  public milestoneId: string;

  /**
   * the deadline of the milestone
   */
  public deadline: Date;

  /**
   * milestone detail
   */
  public detail: string;

  /**
   * reprecentational value of the milestone as percentage (request form sarah)
   */
  public representationalValue?: number;

  public createdAt: Date;

  public updatedAt: Date;
}
