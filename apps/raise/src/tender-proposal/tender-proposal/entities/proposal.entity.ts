import { BeneficiaryEntity } from '../../tender-proposal-beneficiaries/entity/beneficiary.entity';
import { ProposalPaymentEntity } from '../../tender-proposal-payment/entities/proposal-payment.entity';
import { ProjectTimelineEntity } from '../../tender-proposal-timeline/entities/project-timeline.entity';

export class ProposalEntity {
  id: string;
  project_name: string;
  submitter_user_id: string;
  created_at: Date;
  project_track?: string;
  project_idea?: string;
  project_implement_date: Date;
  project_location?: string;
  num_ofproject_binicficiaries?: number;
  project_goals?: string;
  project_outputs?: string;
  project_strengths?: string;
  project_risks?: string;
  pm_name?: string;
  pm_email?: string;
  pm_mobile?: string;
  governorate?: string;
  region?: string;
  amount_required_fsupport?: number;
  need_consultant: boolean = false;
  step: string = 'ZERO';
  whole_budget?: number;
  state: string = 'MODERATOR';
  inner_status?: string = 'CREATED_BY_CLIENT';
  previously_add_bank: string[];
  outter_status: string = 'ONGOING';
  project_beneficiaries?: string;
  number_of_payments?: number;
  finance_id?: string;
  cashier_id?: string;
  project_manager_id?: string;
  supervisor_id?: string;
  project_attachments: any; //Json?
  letter_ofsupport_req: any; //Json?
  on_revision: boolean = false;
  on_consulting: boolean = false;
  proposal_bank_id?: string;
  partial_support_amount?: number;
  project_beneficiaries_specific_type?: string;
  track_id?: string;
  updated_at: Date;
  clasification_field?: string;
  closing_report?: boolean;
  support_type?: boolean;
  does_an_agreement?: boolean;
  need_picture?: boolean;
  support_outputs?: string;
  clause?: string;
  vat?: boolean;
  vat_percentage?: number;
  inclu_or_exclu?: boolean;
  fsupport_by_supervisor?: number;
  number_of_payments_by_supervisor?: number;
  chairman_of_board_of_directors?: string;
  been_supported_before?: boolean;
  most_clents_projects?: string;
  added_value?: string;
  reasons_to_accept?: string;
  target_group_num?: number;
  target_group_type?: string;
  target_group_age?: string;
  been_made_before?: boolean;
  remote_or_insite?: string;
  old_inner_status?: string;
  support_goal_id?: string;
  accreditation_type_id?: string;
  execution_time?: number;
  oid?: number;
  project_number: number;
  project_numbers1: number;
  // notification                        notification[]
  payments?: ProposalPaymentEntity[];
  project_timeline?: ProjectTimelineEntity[];
  proposal_beneficiaries: BeneficiaryEntity[];
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
  // track                               track?                           @relation(fields: [track_id], references: [id], onUpdate: NoAction)
  // proposal_asked_edit_request         proposal_asked_edit_request[]
  // proposal_assign                     proposal_assign[]
  // proposal_closing_report             proposal_closing_report[]
  // proposal_comment                    proposal_comment[]
  // proposal_edit_request               proposal_edit_request?
  // follow_ups                          proposal_follow_up[]
  // proposal_item_budgets               proposal_item_budget[]
  // proposal_logs                       proposal_log[]
  // recommended_support_consultant      recommended_support_consultant[]
  // payment_configuration               supervisor[]
}
