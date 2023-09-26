import { AggregateRoot } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { BeneficiaryEntity } from '../../../beneficiary/entity/beneficiary.entity';
import { CreateNotificationEvent } from '../../../notification-management/notification/event/create.notification.event';
import { TrackEntity } from '../../../tender-track/track/entities/track.entity';
import { UserEntity } from '../../../tender-user/user/entities/user.entity';
import { ProposalCloseReportEntity } from '../../closing-report/entity/proposal.close.report.entity';
import { ProposalFollowUpEntity } from '../../follow-up/entities/proposal.follow.up.entity';
import { ProposalItemBudgetEntity } from '../../item-budget/entities/proposal.item.budget.entity';
import { ProposalPaymentEntity } from '../../payment/entities/proposal-payment.entity';
import { ProposalProjectTimelineEntity } from '../../poject-timelines/entities/proposal.project.timeline.entity';
import { ProposalLogEntity } from '../../proposal-log/entities/proposal-log.entity';
import { BankInformationEntity } from '../../../bank/entities/bank-information.entity';
import { RegionEntity } from '../../../region-management/region/entities/region.entity';
import { GovernorateEntity } from '../../../region-management/governorate/entities/governorate.entity';
import { ProposalGovernorateEntity } from '../../proposal-regions/governorate/entities/proposal.governorate.entity';
import { ProposalRegionEntity } from '../../proposal-regions/region/entities/proposal.region.entity';

export interface ISendNotificaitonEvent {
  notif_type: 'EMAIL' | 'SMS';
  user_id: string;
  subject: string;
  content: string;
  user_email?: string;
  user_phone?: string;
  email_type?: 'template' | 'plain';
  emailTemplateContext?: Record<string, any>;
  emailTemplatePath?: string;
}
export class ProposalEntity extends AggregateRoot {
  // notification                        notification[]
  accreditation_type_id?: string | null;
  added_value?: string | null;
  amount_required_fsupport?: number | null;
  been_made_before?: boolean | null;
  been_supported_before?: boolean | null;
  beneficiary_detail?: BeneficiaryEntity;
  beneficiary_id?: string | null;
  cashier_id?: string | null;
  chairman_of_board_of_directors?: string | null;
  clasification_field?: string | null;
  clause?: string | null;
  closing_report?: boolean | null;
  created_at?: Date | null;
  does_an_agreement?: boolean | null;
  execution_time?: number | null;
  finance_id?: string | null;
  follow_ups?: ProposalFollowUpEntity[];
  fsupport_by_supervisor?: number | null;
  governorate?: string | null;
  governorate_id?: string | null;
  governorate_detail?: GovernorateEntity;
  proposal_governorates: ProposalGovernorateEntity[];
  id: string;
  inclu_or_exclu?: boolean | null;
  inner_status?: string | null;
  letter_ofsupport_req: any; //Json?
  most_clents_projects?: string | null;
  need_consultant?: boolean | null;
  need_picture?: boolean | null;
  num_ofproject_binicficiaries?: number | null;
  number_of_payments?: number | null;
  number_of_payments_by_supervisor?: number | null;
  oid?: number | null;
  old_inner_status?: string | null;
  on_consulting?: boolean | null;
  on_revision?: boolean | null;
  outter_status?: string | null;
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
  proposal_logs?: ProposalLogEntity[];
  reasons_to_accept?: string | null;
  region?: string | null;
  region_id?: string | null;
  proposal_regions: ProposalRegionEntity[];
  region_detail?: RegionEntity;
  remote_or_insite?: string | null;
  state?: string | null;
  step?: string | null;
  submitter_user_id: string;
  supervisor_id?: string | null;
  support_goal_id?: string | null;
  support_outputs?: string | null;
  support_type?: boolean | null;
  target_group_age?: string | null;
  target_group_num?: number | null;
  target_group_type?: string | null;
  track?: TrackEntity | null;
  track_id?: string | null;
  updated_at?: Date | null;
  vat?: boolean | null;
  vat_percentage?: number | null;
  whole_budget?: number | null;
  user?: UserEntity;
  supervisor?: UserEntity;
  proposal_closing_report?: ProposalCloseReportEntity[];
  bank_information?: BankInformationEntity;
  // accreditation_type                  accreditation_type?              @relation(fields: [accreditation_type_id], references: [id])
  // project_tracks                      project_tracks?                  @relation(fields: [project_track], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "proposal_project_kind_id_fkey")
  // project_manager                     user?                            @relation("proposal_project_manager_idTouser", fields: [project_manager_id], references: [id], onDelete: Cascade)
  // proposal_request                    proposal_request?                @relation(fields: [outter_status], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "proposal_requested_fkey")
  // user_type                           user_type?                       @relation(fields: [state], references: [id], onDelete: NoAction, onUpdate: NoAction)
  // proposal_status                     proposal_status?                 @relation(fields: [inner_status], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "proposal_status_fkey")
  // proposal_step                       proposal_step?                   @relation(fields: [step], references: [id], onDelete: NoAction, onUpdate: NoAction)
  // support_goal                        support_goal?                    @relation(fields: [support_goal_id], references: [id])
  // proposal_asked_edit_request         proposal_asked_edit_request[]
  // proposal_assign                     proposal_assign[]
  // proposal_comment                    proposal_comment[]
  // proposal_edit_request               proposal_edit_request?
  // recommended_support_consultant      recommended_support_consultant[]
  // payment_configuration               supervisor[]

  /**
   * emit event to send notification.
   */
  sendNotificaitonEvent(props: ISendNotificaitonEvent) {
    const eventBuilder = Builder<CreateNotificationEvent>(
      CreateNotificationEvent,
      {
        type: props.notif_type,
        user_id: props.user_id,
        content: props.content,
        subject: props.subject,
        email: props.user_email,
        email_sender: 'no-reply@hcharity.org',
        phone_number: props.user_phone,
        email_type: props.email_type,
        emailTemplateContext: props.emailTemplateContext,
        emailTemplatePath: props.emailTemplatePath,
      },
    );
    this.apply(eventBuilder.build());
  }
}
