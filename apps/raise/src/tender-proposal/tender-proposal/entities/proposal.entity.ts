import { TrackEntity } from '../../../tender-track/track/entities/track.entity';
import { BeneficiaryEntity } from '../../tender-proposal-beneficiaries/entity/beneficiary.entity';
import { ProposalFollowUpEntity } from '../../tender-proposal-follow-up/entities/proposal-follow-up.entity';
import { ProposalLogEntity } from '../../tender-proposal-log/entities/proposal-log.entity';
import { ProposalPaymentEntity } from '../../tender-proposal-payment/entities/proposal-payment.entity';
import { ProjectTimelineEntity } from '../../tender-proposal-timeline/entities/project-timeline.entity';

export class ProposalEntity {
  id: string;
  project_name: string;
  submitter_user_id: string;
  project_track?: string | null; // deprecated, use track_id and refer to track entity
  project_idea?: string | null;
  project_implement_date?: Date | null;
  project_location?: string | null;
  num_ofproject_binicficiaries?: number | null;
  project_goals?: string | null;
  project_outputs?: string | null;
  project_strengths?: string | null;
  project_risks?: string | null;
  pm_name?: string | null;
  pm_email?: string | null;
  pm_mobile?: string | null;
  governorate?: string | null;
  region?: string | null;
  amount_required_fsupport?: number | null;
  need_consultant?: boolean | null;
  step?: string | null;
  whole_budget?: number | null;
  state?: string | null = 'MODERATOR';
  inner_status?: string | null = 'CREATED_BY_CLIENT';
  previously_add_bank: string[];
  outter_status?: string | null = 'ONGOING';
  project_beneficiaries?: string | null;
  number_of_payments?: number | null;
  finance_id?: string | null;
  cashier_id?: string | null;
  project_manager_id?: string | null;
  supervisor_id?: string | null;
  project_attachments: any; //Json?
  letter_ofsupport_req: any; //Json?
  on_revision?: boolean | null = false;
  on_consulting?: boolean | null = false;
  proposal_bank_id?: string | null;
  partial_support_amount?: number | null;
  project_beneficiaries_specific_type?: string | null;
  track_id?: string | null;
  clasification_field?: string | null;
  closing_report?: boolean | null = false;
  support_type?: boolean | null = false;
  does_an_agreement?: boolean | null = false;
  need_picture?: boolean | null = false;
  support_outputs?: string | null;
  clause?: string | null;
  vat?: boolean | null = false;
  vat_percentage?: number | null;
  inclu_or_exclu?: boolean | null = false;
  fsupport_by_supervisor?: number | null;
  number_of_payments_by_supervisor?: number | null;
  chairman_of_board_of_directors?: string | null;
  been_supported_before?: boolean | null = false;
  most_clents_projects?: string | null;
  added_value?: string | null;
  reasons_to_accept?: string | null;
  target_group_num?: number | null;
  target_group_type?: string | null;
  target_group_age?: string | null;
  been_made_before?: boolean | null = false;
  remote_or_insite?: string | null;
  old_inner_status?: string | null;
  support_goal_id?: string | null;
  accreditation_type_id?: string | null;
  execution_time?: number | null;
  oid?: number | null;
  project_number?: number | null;
  project_numbers1: number;
  // notification                        notification[]
  payments?: ProposalPaymentEntity[];
  project_timeline?: ProjectTimelineEntity[];
  proposal_beneficiaries: BeneficiaryEntity[];
  track?: TrackEntity | null;
  created_at?: Date | null = new Date();
  updated_at?: Date | null = new Date();
  proposal_log?: ProposalLogEntity[];
  beneficiary_id?: string | null;
  beneficiary_detail?: BeneficiaryEntity;
  follow_ups?: ProposalFollowUpEntity[];
  // accreditation_type                  accreditation_type?              @relation(fields: [accreditation_type_id], references: [id])
  // project_tracks                      project_tracks?                  @relation(fields: [project_track], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "proposal_project_kind_id_fkey")
  // project_manager                     user?                            @relation("proposal_project_manager_idTouser", fields: [project_manager_id], references: [id], onDelete: Cascade)
  // bank_information                    bank_information?                @relation("bank_informationToproposal_proposal_bank_id", fields: [proposal_bank_id], references: [id], onDelete: Cascade)
  // proposal_request                    proposal_request?                @relation(fields: [outter_status], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "proposal_requested_fkey")
  // user_type                           user_type?                       @relation(fields: [state], references: [id], onDelete: NoAction, onUpdate: NoAction)
  // proposal_status                     proposal_status?                 @relation(fields: [inner_status], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "proposal_status_fkey")
  // proposal_step                       proposal_step?                   @relation(fields: [step], references: [id], onDelete: NoAction, onUpdate: NoAction)
  // user                                user                             @relation(fields: [submitter_user_id], references: [id], onDelete: Cascade)
  // supervisor                          user?                            @relation("proposal_supervisor_idTouser", fields: [supervisor_id], references: [id], onDelete: Cascade)
  // support_goal                        support_goal?                    @relation(fields: [support_goal_id], references: [id])
  // proposal_asked_edit_request         proposal_asked_edit_request[]
  // proposal_assign                     proposal_assign[]
  // proposal_closing_report             proposal_closing_report[]
  // proposal_comment                    proposal_comment[]
  // proposal_edit_request               proposal_edit_request?
  // proposal_item_budgets               proposal_item_budget[]
  // recommended_support_consultant      recommended_support_consultant[]
  // payment_configuration               supervisor[]
}
