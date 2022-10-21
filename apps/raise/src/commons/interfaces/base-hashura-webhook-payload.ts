// payload {
//   created_at: '2022-10-18T20:09:07.137478Z',
//   delivery_info: { current_retry: 0, max_retries: 3 },
//   event: {
//     data: { new: [Object], old: null },
//     op: 'INSERT',
//     session_variables: {
//       'x-hasura-app-id': 'b5ee66f1-cc1c-4185-97a9-e562ce8e98f6',
//       'x-hasura-role': 'tender_client',
//       'x-hasura-tenant-id': '731425cc-2184-4b75-a895-e075cdef99ec',
//       'x-hasura-user-id': '969c6921-c3c2-4796-a0c4-9cd567d78a28'
//     },
//     trace_context: { span_id: '9c3447de230fcea3', trace_id: 'f361cde07e3f5c3a' }
//   },
//   id: '988972a4-710c-49ba-8360-8743b23e98e2',
//   table: { name: 'edit_request', schema: 'public' },
//   trigger: { name: 'edit_request_denactive_users' }
// }

export type HashuraWebhookDeliveryInfo = {
  current_retry: number;
  max_retries: number;
};

export type HashuraWebhookEventData = {
  new: any;
  old: any;
};

export type HashuraWebhookEventOp = 'INSERT' | 'UPDATE' | 'DELETE';

export type HashuraWebhookEventSessionVariables = {
  'x-hasura-app-id': string;
  'x-hasura-role': string;
  'x-hasura-tenant-id': string;
  'x-hasura-user-id': string;
};

export type HashuraWebhookEventTraceContext = {
  span_id: string;
  trace_id: string;
};

export type HashuraWebhookEvent = {
  data: HashuraWebhookEventData;
  op: HashuraWebhookEventOp;
  session_variables: HashuraWebhookEventSessionVariables;
};

export type HashuraWebhookTableResponse = {
  name: string;
  schema: string;
};

export type HashuraWebhookTriggerResponse = {
  name: string;
};

export type BaseHashuraWebhookPayload = {
  created_at: string;
  delivery_info: HashuraWebhookDeliveryInfo;
  event: HashuraWebhookEvent;
  id: string;
  table: HashuraWebhookTableResponse;
  trigger: HashuraWebhookTriggerResponse;
};
