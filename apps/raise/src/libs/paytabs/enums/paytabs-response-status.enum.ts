/**
 * Ref: https://support.paytabs.com/en/support/solutions/articles/60000711358-what-is-response-code-vs-the-response-status-
 *
 * What are the general response statuses?
 * Response Status  | Description
 * -----------------|------------
 * A                | Authorized
 * C                | Cancelled
 * D                | Declined
 * E                | Error
 * H                | Hold (Authorized but on hold for further anti-fraud review)
 * P                | Pending (for refunds)
 * V                | Voided
 * X                | Authorisation expired
 */

export enum PaytabsResponseStatus {
  A = 'A',
  C = 'C',
  D = 'D',
  E = 'E',
  H = 'H',
  P = 'P',
  V = 'V',
  X = 'X',
}
