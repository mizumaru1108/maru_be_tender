export default class StripeErrors {
  public static createStripeCheckoutTransactionError = (message?: string) => ({
    errorCode: 5600,
    message: message
      ? message
      : 'Error in create stripe checkout transaction error',
  });

  public static createStripePaymentIntentError = (message?: string) => ({
    errorCode: 5601,
    message: message ? message : 'Error in create stripe paymentIntent',
  });

  public static createStripeChargeError = (message?: string) => ({
    errorCode: 5602,
    message: message ? message : 'Error in create stripeCharge',
  });
}
