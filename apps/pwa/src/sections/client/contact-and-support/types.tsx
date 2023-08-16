export interface ContactUsGeneral {
  inquiry_type?: string;
  title?: string;
  message?: string;
}
export interface ContactUsVisit {
  inquiry_type?: string;
  date_of_visit?: string;
  visit_reason?: string;
}

export interface ContactUsInquiry {
  inquiry_type?: string;
  proposal_id?: string;
  title?: string;
  message?: string;
}

export type ContactSupportProps = {
  inquiry_type?: string;
  title?: string;
  message?: string;
  date_of_visit?: string;
  visit_reason?: string;
  proposal_id?: string;
};
