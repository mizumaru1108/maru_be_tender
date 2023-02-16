import { RawCreateFollowUpDto } from '../dtos/responses/raw-create-follow-up.dto';

export const GenerateFollowUpMessageNotif = (
  createdFolllowUp: RawCreateFollowUpDto['data'],
) => {
  const { proposal, user } = createdFolllowUp;
  const subject = `Proposal Follow Up Notification`;
  const content = `There's a New Follow Up on Project ${proposal.project_name} from ${user.employee_name}`;
  return {
    subject,
    content,
    proposal,
    user,
  };
};
