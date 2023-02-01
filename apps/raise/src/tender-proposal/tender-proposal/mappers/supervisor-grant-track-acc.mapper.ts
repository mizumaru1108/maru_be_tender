import { Prisma } from '@prisma/client';
import { SupervisorChangeStatePayload } from '../dtos/requests/supervisor-change-state.dto';

export const SupervisorGrantTrackAccMapper = (
  prevUpdatePayload: Prisma.proposalUncheckedUpdateInput,
  request: SupervisorChangeStatePayload,
): Prisma.proposalUncheckedUpdateInput => {
  const newMappedUpdatePayload: Prisma.proposalUncheckedUpdateInput =
    prevUpdatePayload;

  if (request.accreditation_type_id) {
    newMappedUpdatePayload.accreditation_type_id =
      request.accreditation_type_id;
  }

  if (request.chairman_of_board_of_directors) {
    newMappedUpdatePayload.chairman_of_board_of_directors =
      request.chairman_of_board_of_directors;
  }

  if (request.most_clents_projects) {
    newMappedUpdatePayload.most_clents_projects = request.most_clents_projects;
  }

  if (request.been_supported_before) {
    newMappedUpdatePayload.been_supported_before =
      request.been_supported_before;
  }

  if (request.added_value) {
    newMappedUpdatePayload.added_value = request.added_value;
  }

  if (request.reasons_to_accept) {
    newMappedUpdatePayload.reasons_to_accept = request.reasons_to_accept;
  }

  if (request.target_group_num) {
    newMappedUpdatePayload.target_group_num = request.target_group_num;
  }

  if (request.target_group_type) {
    newMappedUpdatePayload.target_group_type = request.target_group_type;
  }

  if (request.target_group_age) {
    newMappedUpdatePayload.target_group_age = request.target_group_age;
  }

  if (request.been_made_before) {
    newMappedUpdatePayload.been_made_before = request.been_made_before;
  }

  if (request.remote_or_insite) {
    newMappedUpdatePayload.remote_or_insite = request.remote_or_insite;
  }

  return newMappedUpdatePayload;
};
