export enum InnerStatusEnum {
  CREATED_BY_CLIENT = 'CREATED_BY_CLIENT',
  ACCEPTED_BY_MODERATOR = 'ACCEPTED_BY_MODERATOR',
  REJECTED_BY_MODERATOR = 'REJECTED_BY_MODERATOR',
  ACCEPTED_BY_SUPERVISOR = 'ACCEPTED_BY_SUPERVISOR',
  REJECTED_BY_SUPERVISOR = 'REJECTED_BY_SUPERVISOR',
  ACCEPTED_BY_PROJECT_MANAGER = 'ACCEPTED_BY_PROJECT_MANAGER',
  REJECTED_BY_PROJECT_MANAGER = 'REJECTED_BY_PROJECT_MANAGER',
  ACCEPTED_AND_NEED_CONSULTANT = 'ACCEPTED_AND_NEED_CONSULTANT', // pm
  ACCEPTED_BY_CONSULTANT = 'ACCEPTED_BY_CONSULTANT',
  REJECTED_BY_CONSULTANT = 'REJECTED_BY_CONSULTANT',
  ACCEPTED_BY_CEO= 'ACCEPTED_BY_CEO',
  REJECTED_BY_CEO = 'REJECTED_BY_CEO',
}