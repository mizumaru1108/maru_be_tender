import { TrackEntity } from '../../../tender-track/track/entities/track.entity';
import { BeneficiaryEntity } from '../../../beneficiary/entity/beneficiary.entity';
import { ProposalFollowUpEntity } from '../../follow-up/entities/proposal.follow.up.entity';
import { ProposalLogEntity } from '../../proposal-log/entities/proposal-log.entity';
import { ProposalPaymentEntity } from '../../payment/entities/proposal-payment.entity';
import { ProposalProjectTimelineEntity } from '../../poject-timelines/entities/proposal.project.timeline.entity';
import { ProposalItemBudgetEntity } from '../../item-budget/entities/proposal.item.budget.entity';
import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { CreateNotificationEvent } from '../../../notification-management/notification/event/create.notification.event';

export class ProposalEntity extends AggregateRoot {
  // notification                        notification[]
  accreditation_type_id?: string | null;
  added_value?: string | null;
  amount_required_fsupport?: number | null;
  been_made_before?: boolean | null = false;
  been_supported_before?: boolean | null = false;
  beneficiary_detail?: BeneficiaryEntity;
  beneficiary_id?: string | null;
  cashier_id?: string | null;
  chairman_of_board_of_directors?: string | null;
  clasification_field?: string | null;
  clause?: string | null;
  closing_report?: boolean | null = false;
  created_at?: Date | null = new Date();
  does_an_agreement?: boolean | null = false;
  execution_time?: number | null;
  finance_id?: string | null;
  follow_ups?: ProposalFollowUpEntity[];
  fsupport_by_supervisor?: number | null;
  governorate?: string | null;
  id: string;
  inclu_or_exclu?: boolean | null = false;
  inner_status?: string | null = 'CREATED_BY_CLIENT';
  letter_ofsupport_req: any; //Json?
  most_clents_projects?: string | null;
  need_consultant?: boolean | null;
  need_picture?: boolean | null = false;
  num_ofproject_binicficiaries?: number | null;
  number_of_payments?: number | null;
  number_of_payments_by_supervisor?: number | null;
  oid?: number | null;
  old_inner_status?: string | null;
  on_consulting?: boolean | null = false;
  on_revision?: boolean | null = false;
  outter_status?: string | null = 'ONGOING';
  partial_support_amount?: number | null;
  payments?: ProposalPaymentEntity[];
  pm_email?: string | null;
  pm_mobile?: string | null;
  pm_name?: string | null;
  previously_add_bank?: string[] | null;
  project_attachments: any; //Json?
  project_beneficiaries?: string | null;
  project_beneficiaries_specific_type?: string | null;
  project_goals?: string | null;
  project_idea?: string | null;
  project_implement_date?: Date | null;
  project_location?: string | null;
  project_manager_id?: string | null;
  project_name: string;
  project_number?: number | null;
  project_numbers1?: number | null;
  project_outputs?: string | null;
  project_risks?: string | null;
  project_strengths?: string | null;
  project_timeline?: ProposalProjectTimelineEntity[];
  project_track?: string | null; // deprecated, use track_id and refer to track entity
  proposal_bank_id?: string | null;
  proposal_beneficiaries?: BeneficiaryEntity[];
  proposal_item_budgets?: ProposalItemBudgetEntity[];
  proposal_log?: ProposalLogEntity[];
  reasons_to_accept?: string | null;
  region?: string | null;
  remote_or_insite?: string | null;
  state?: string | null = 'MODERATOR';
  step?: string | null;
  submitter_user_id: string;
  supervisor_id?: string | null;
  support_goal_id?: string | null;
  support_outputs?: string | null;
  support_type?: boolean | null = false;
  target_group_age?: string | null;
  target_group_num?: number | null;
  target_group_type?: string | null;
  track?: TrackEntity | null;
  track_id?: string | null;
  updated_at?: Date | null = new Date();
  vat?: boolean | null = false;
  vat_percentage?: number | null;
  whole_budget?: number | null;
  user?: UserEntity;
  supervisor?: UserEntity;
  // accreditation_type                  accreditation_type?              @relation(fields: [accreditation_type_id], references: [id])
  // project_tracks                      project_tracks?                  @relation(fields: [project_track], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "proposal_project_kind_id_fkey")
  // project_manager                     user?                            @relation("proposal_project_manager_idTouser", fields: [project_manager_id], references: [id], onDelete: Cascade)
  // bank_information                    bank_information?                @relation("bank_informationToproposal_proposal_bank_id", fields: [proposal_bank_id], references: [id], onDelete: Cascade)
  // proposal_request                    proposal_request?                @relation(fields: [outter_status], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "proposal_requested_fkey")
  // user_type                           user_type?                       @relation(fields: [state], references: [id], onDelete: NoAction, onUpdate: NoAction)
  // proposal_status                     proposal_status?                 @relation(fields: [inner_status], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "proposal_status_fkey")
  // proposal_step                       proposal_step?                   @relation(fields: [step], references: [id], onDelete: NoAction, onUpdate: NoAction)
  // support_goal                        support_goal?                    @relation(fields: [support_goal_id], references: [id])
  // proposal_asked_edit_request         proposal_asked_edit_request[]
  // proposal_assign                     proposal_assign[]
  // proposal_closing_report             proposal_closing_report[]
  // proposal_comment                    proposal_comment[]
  // proposal_edit_request               proposal_edit_request?
  // recommended_support_consultant      recommended_support_consultant[]
  // payment_configuration               supervisor[]

  /**
   * emit event to create a customer after creating a user.
   */
  sendNotificaitonEvent(
    user_id: string,
    user_email: string,
    user_phone: string,
    subject: string,
    content: string,
  ) {
    // organization_id: string, // payload: RegisterMerchantCommand,
    const eventBuilder = Builder<CreateNotificationEvent>(
      CreateNotificationEvent,
      {
        user_id: '',
      },
    );
    this.apply(eventBuilder.build());
  }
}
