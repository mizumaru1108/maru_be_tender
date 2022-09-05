/**
 * Possible enum values
 * Ref: https://stripe.com/docs/api/checkout/sessions/create?lang=curl
 */
export enum StripeCheckoutSessionMode {
  /**
   * Accept one-time payments for cards, iDEAL, and more.
   */
  PAYMENT = 'payment',

  /**
   * Save payment details to charge your customers later.
   */
  SETUP = 'setup',

  /**
   * Use Stripe Billing to set up fixed-price subscriptions.
   */
  SUBSCRIPTION = 'subscription',
}
