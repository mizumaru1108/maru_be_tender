import { Prisma } from '@prisma/client';
import { ProjectManagerChangeStatePayload } from '../dtos/requests/project-manager-change-state-payload.dto';
import { CeoChangeStatePayload } from '../dtos/requests/ceo-change-state.dto';

export const UpdateProposalTrackInfoMapper = (
  prevUpdatePayload: Prisma.proposalUncheckedUpdateInput,
  request: ProjectManagerChangeStatePayload | CeoChangeStatePayload,
): Prisma.proposalUncheckedUpdateInput => {
  const newMappedUpdatePayload: Prisma.proposalUncheckedUpdateInput =
    prevUpdatePayload;

  if (request.inclu_or_exclu !== undefined) {
    newMappedUpdatePayload.inclu_or_exclu = request.inclu_or_exclu;
  }

  if (request.vat_percentage) {
    newMappedUpdatePayload.vat_percentage = request.vat_percentage;
  }

  if (request.support_goal_id) {
    newMappedUpdatePayload.support_goal_id = request.support_goal_id;
  }

  if (request.vat !== undefined) {
    newMappedUpdatePayload.vat = request.vat;
  }

  if (request.support_outputs) {
    newMappedUpdatePayload.support_outputs = request.support_outputs;
  }

  if (request.number_of_payments_by_supervisor) {
    newMappedUpdatePayload.number_of_payments_by_supervisor =
      request.number_of_payments_by_supervisor;
  }

  if (request.fsupport_by_supervisor) {
    newMappedUpdatePayload.fsupport_by_supervisor =
      request.fsupport_by_supervisor;
  }

  if (request.does_an_agreement !== undefined) {
    newMappedUpdatePayload.does_an_agreement = request.does_an_agreement;
  }

  if (request.need_picture !== undefined) {
    newMappedUpdatePayload.need_picture = request.need_picture;
  }

  if (request.closing_report !== undefined) {
    newMappedUpdatePayload.closing_report = request.closing_report;
  }

  if (request.support_type !== undefined) {
    newMappedUpdatePayload.support_type = request.support_type;
  }

  if (request.clause) {
    newMappedUpdatePayload.clause = request.clause;
  }

  if (request.clasification_field) {
    newMappedUpdatePayload.clasification_field = request.clasification_field;
  }

  return newMappedUpdatePayload;
};
