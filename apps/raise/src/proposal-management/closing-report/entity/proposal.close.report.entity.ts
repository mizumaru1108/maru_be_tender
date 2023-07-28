// id                      String    @id(map: "closing_report_request_pkey")
//   proposal_id             String
//   number_of_beneficiaries Int
//   target_beneficiaries    String    @db.VarChar
//   execution_place         String    @db.VarChar
//   gender                  String    @db.VarChar
//   project_duration        String    @db.VarChar
//   project_repeated        String    @db.VarChar
//   number_of_volunteer     Int
//   number_of_staff         Int
//   attachments             Json
//   images                  Json
//   created_at              DateTime? @default(now()) @db.Timestamptz(6)
//   updated_at              DateTime? @default(now()) @db.Timestamptz(6)
//   proposal                proposal  @relation(fields: [proposal_id], references: [id], onDelete: Cascade, map: "closing_report_request_proposal_id_fkey")

import { ClosingReportBeneficiariesEntity } from 'src/proposal-management/closing-report/entity/closing.report.beneficiaries.entity';
import { ClosingReportExecutionPlacesEntity } from 'src/proposal-management/closing-report/entity/closing.report.execution.places.entity';
import { ClosingReportGendersEntity } from 'src/proposal-management/closing-report/entity/closing.report.genders.entity';
import { ProposalEntity } from 'src/proposal-management/proposal/entities/proposal.entity';

export class ProposalCloseReportEntity {
  id: string;
  proposal_id: string;
  number_of_beneficiaries: number;
  target_beneficiaries?: string | null; // deprecated
  beneficiaries: ClosingReportBeneficiariesEntity[];
  execution_place?: string | null; // multiple
  execution_places: ClosingReportExecutionPlacesEntity[];
  gender?: string | null; // deprecated
  genders: ClosingReportGendersEntity[];
  project_duration: string;
  project_repeated: string;
  number_of_volunteer: number;
  number_of_staff: number;
  attachments: any; // Json
  images: any; // json
  created_at: Date | null = new Date();
  updated_at: Date | null = new Date();
  proposal?: ProposalEntity;
}
