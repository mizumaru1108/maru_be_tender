import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { StripeCheckoutSessionMode } from '../enums/stripe-checkout-session-mode.enum';

/**
 * Stripe Creates a session object.
 * ref: https://stripe.com/docs/api/checkout/sessions/create?lang=curl
 */
export class StripeCheckoutCreateSession {
  /**
   * The URL to which Stripe should send customers when payment or
   * setup is complete. If you’d like to use information from the
   * successful Checkout Session on your page, read the guide on
   * customizing your success page. (Required)
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public success_url: string;

  /**
   * The URL the customer will be directed to if they decide to
   * cancel payment and return to your website. (Required)
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public cancel_url: string;

  /**
   * The mode of the Checkout Session. Required when using prices or
   * setup mode. Pass subscription if the Checkout Session includes
   * at least one recurring item. (Required conditionally)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(StripeCheckoutSessionMode)
  public mode?: StripeCheckoutSessionMode = StripeCheckoutSessionMode.PAYMENT;

  /**
   * A unique string to reference the Checkout Session. This can be a
   * customer ID, a cart ID, or similar, and can be used to reconcile
   * the session with your internal systems. (optional)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public client_reference_id?: string;

  /**
   * Three-letter ISO currency code (ISO 4217), in lowercase. Must be a supported currency. (optional)
   * ref:
   * https://stripe.com/docs/currencies // supported currencies
   * https://www.iso.org/iso-4217-currency-codes.html // ISO 4217
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency?: string;

  constructor(
    success_url: string,
    cancel_url: string,
    mode?: StripeCheckoutSessionMode,
  ) {
    this.success_url = success_url;
    this.cancel_url = cancel_url;
    this.mode = mode;
  }
}
