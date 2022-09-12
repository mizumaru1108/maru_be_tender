import { v4 as uuidv4 } from 'uuid';
import { CreateMilestoneDto } from '../dto/milestone/requests/create-milestone.dto';
import { UpdateMilestoneDto } from '../dto/milestone/requests/update-milestone.dto';
/**
 * not using doc type nor schema (it will be used as a type also a validator)
 */
export class CampaignMilestone {
  /**
   * milestoneId (why?, for make it easied to query)
   */
  public milestoneId: string;

  public name: string;

  /**
   * the deadline of the milestone
   */
  public deadline: Date;

  public detail: string;

  /**
   * reprecentational value of the milestone as percentage (request form sarah)
   */
  public representationalValue?: number;

  public createdAt: Date;

  public updatedAt: Date;

  static mapFromCreateRequest(request: CreateMilestoneDto): CampaignMilestone {
    const milestone = new CampaignMilestone();
    milestone.milestoneId = uuidv4();
    milestone.name = request.name;
    milestone.detail = request.detail;
    milestone.deadline = new Date(request.deadline);
    milestone.representationalValue = request.representationalValue;
    milestone.createdAt = new Date();
    milestone.updatedAt = new Date();
    return milestone;
  }

  static mapFromUpdateRequest(request: UpdateMilestoneDto): CampaignMilestone {
    const milestone = new CampaignMilestone();
    request.name && (milestone.name = request.name);
    request.deadline && (milestone.deadline = new Date(request.deadline));
    request.detail && (milestone.detail = request.detail);
    if (request.representationalValue) {
      milestone.representationalValue = request.representationalValue;
    }
    milestone.updatedAt = new Date();
    return milestone;
  }
}
