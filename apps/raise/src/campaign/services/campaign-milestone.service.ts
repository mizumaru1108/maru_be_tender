import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { rootLogger } from '../../logger';
import { AddMilestoneDto } from '../dto/milestone/requests/add-milestone.dto';
import { CampaignMilestone } from '../schema/campaign-milestone.schema';
import { Campaign, CampaignDocument } from '../schema/campaign.schema';
import dayjs from 'dayjs';
import { AddMilestoneResponseDto } from '../dto/milestone/responses/add-milestone-response.dto';
import { EditMilestoneDto } from '../dto/milestone/requests/edit-milestone.dto';
import { UpdateMilestoneResponseDto } from '../dto/milestone/responses/update-milestone-response';
import { DeleteMilestoneDto } from '../dto/milestone/requests/delete-milestone.dto';

@Injectable()
export class CampaignMilestoneService {
  private logger = rootLogger.child({ logger: CampaignMilestoneService.name });
  constructor(
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
  ) {}

  async addMilestone(
    userId: string,
    request: AddMilestoneDto,
  ): Promise<AddMilestoneResponseDto> {
    const campaign = await this.campaignModel.findById(
      new Types.ObjectId(request.campaignId),
    );
    if (!campaign) {
      throw new NotFoundException(
        `Campaign with id ${request.campaignId} not found`,
      );
    }
    const milestone = CampaignMilestone.mapFromCreateRequest(
      request.addedMilestone,
    );

    // add milestone to campaign
    campaign.milestone.push(milestone);
    campaign.updaterUserId = userId;
    campaign.updatedAt = dayjs().toISOString();
    const updatedCampaign = await campaign.save();
    if (!updatedCampaign) {
      throw new Error(
        `Error occured when updating campaign ${campaign.campaignId}`,
      );
    }
    const response: AddMilestoneResponseDto = {
      updatedCampaign,
      addedMilestones: [milestone],
    };
    return response;
  }

  async editMilestone(
    userId: string,
    request: EditMilestoneDto,
  ): Promise<UpdateMilestoneResponseDto> {
    const milestone = CampaignMilestone.mapFromUpdateRequest(
      request.editedMilestone,
    );

    // lopp through milestone object and find the one to be updated, then update it,
    // so it will only update the one that is needed, not the whole array.
    const data: Record<string, any> = {};
    for (const [key, value] of Object.entries(milestone)) {
      data[`milestone.$.${key}`] = value;
    }

    // update milestone
    const updatedCampaign = await this.campaignModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(request.campaignId),
        'milestone.milestoneId': request.milestoneId,
      },
      {
        $set: {
          updaterUserId: userId,
          updatedAt: dayjs().toISOString(),
          ...data,
        },
      },
      { new: true },
    );

    if (!updatedCampaign) {
      throw new Error(
        `Error occured when updating campaign ${request.campaignId}`,
      );
    }

    const response: UpdateMilestoneResponseDto = {
      updatedCampaign,
      editedValues: [milestone],
    };

    return response;
  }

  async deleteMilestone(
    userId: string,
    request: DeleteMilestoneDto,
  ): Promise<Campaign> {
    const updatedCampaign = await this.campaignModel.findOneAndUpdate(
      { _id: new Types.ObjectId(request.campaignId) },
      {
        $pull: { milestone: { milestoneId: request.milestoneId } },
        $set: {
          updaterUserId: userId,
          updatedAt: dayjs().toISOString(),
        },
      },
      { new: true },
    );
    if (!updatedCampaign) {
      throw new Error(
        `Error occured when removing ${request.milestoneId} from campaign ${request.campaignId}`,
      );
    }
    return updatedCampaign;
  }
}
