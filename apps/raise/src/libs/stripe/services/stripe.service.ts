import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { rootLogger } from '../../../logger';
import Stripe from 'stripe';
import { SpanStatusCode, trace } from '@opentelemetry/api';

@Injectable()
export class StripeService {
  private logger = rootLogger.child({ logger: StripeService.name });
  // private stripe;

  constructor(private configService: ConfigService) {
    // !TODO: maybe implemented latter on  (current api key getted from fetching from payment gateway schema)
    // const stripe = new Stripe(configService.get<string>("STRIPE_API_KEY"), {
    //   apiVersion: "2020-08-27",
    //   typescript: true,
    // });
  }

  /**
   * !TODO: should be refactored to get api key from config service latter on
   * Create transaction with stipe (Checkout with session)
   */
  async createStripeCheckoutTransaction(
    params: Stripe.Checkout.SessionCreateParams,
    apiKey: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const tracer = trace.getTracer('tmra-raise');
    const span = tracer.startSpan('Stripe Payment Trace ', {
      attributes: { 'donor.firstName': '-' },
    });
    try {
      const stripe = new Stripe(apiKey, {
        apiVersion: '2022-08-01',
        typescript: true,
      });

      this.logger.debug('creating checkout transaction request to stripe ...');
      this.logger.debug('payload: ', JSON.stringify(params));
      const session = await stripe.checkout.sessions.create(params);
      span.setStatus({ code: SpanStatusCode.OK });
      return session;
    } catch (err) {
      // When we catch an error, we want to show that an error occurred
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
      throw err;
    } finally {
      // Every span must be ended or it will not be exported
      span.end();
    }
  }

  async createStripePaymentIntent(
    params: Stripe.PaymentIntentCreateParams,
    apiKey: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const tracer = trace.getTracer('tmra-raise');
    const span = tracer.startSpan('Stripe Payment Trace ', {
      attributes: { 'donor.firstName': '-' },
    });
    try {
      const stripe = new Stripe(apiKey, {
        apiVersion: '2022-08-01',
        typescript: true,
      });

      this.logger.debug('creating payment intent request to stripe ...');
      this.logger.debug('payload: ', JSON.stringify(params));
      const paymentIntent = await stripe.paymentIntents.create(params);
      span.setStatus({ code: SpanStatusCode.OK });
      return paymentIntent;
    } catch (err) {
      // When we catch an error, we want to show that an error occurred
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
      throw err;
    } finally {
      // Every span must be ended or it will not be exported
      span.end();
    }
  }

  async createStripeCharge(
    params: Stripe.ChargeCreateParams,
    apiKey: string,
  ): Promise<Stripe.Response<Stripe.Charge>> {
    const tracer = trace.getTracer('tmra-raise');
    const span = tracer.startSpan('Stripe Payment Trace ', {
      attributes: { 'donor.firstName': '-' },
    });
    try {
      const stripe = new Stripe(apiKey, {
        apiVersion: '2022-08-01',
        typescript: true,
      });

      this.logger.debug('creating charge request to stripe ...');
      this.logger.debug('payload: ', JSON.stringify(params));
      const charge = await stripe.charges.create(params);
      span.setStatus({ code: SpanStatusCode.OK });
      return charge;
    } catch (err) {
      // When we catch an error, we want to show that an error occurred
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
      throw err;
    } finally {
      // Every span must be ended or it will not be exported
      span.end();
    }
  }
}
