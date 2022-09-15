import { CreateMilestoneDto } from '../dto/create-milestone.dto';

/**
 * not using doc type nor schema (it will be used as a type also a validator)
 */
export class CampaignMilestone {
  public name: string;

  /**
   * the deadline of the milestone
   */
  public deadline: Date;

  public detail: string;

  /**
   * reprecentational value of the milestone as percentage (request form sarah)
   */
  public representationalValue: number;

  public createdAt: Date;

  public updatedAt: Date;

  static mapFromRequest(request: CreateMilestoneDto): CampaignMilestone {
    const milestone = new CampaignMilestone();
    milestone.name = request.name;
    milestone.detail = request.detail;
    milestone.deadline = new Date(request.deadline);
    milestone.representationalValue = request.representationalValue;
    milestone.createdAt = new Date();
    milestone.updatedAt = new Date();
    return milestone;
  }
}
