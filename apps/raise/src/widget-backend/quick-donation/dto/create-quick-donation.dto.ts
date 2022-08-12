import { z } from 'zod'

export const GiftImagePayload = z.object({
    base64Data: z.string(),
    imageName: z.string().optional(),
    imagePrefix: z.string().optional(),
    fullName: z.string(),
    imageExtension: z.string().regex(/^[.][^.]+/, "Must start with '.'"),
    currentPhoto: z.string().optional(),
  });
export type GiftImagePayload = z.infer<typeof GiftImagePayload>;
  

export const GiftDetails = z.object({
    giftType: GiftImagePayload,
    cardType: GiftImagePayload,
    donorPhone: z.string().optional(),
    receiverPhone: z.string().optional(),
    donorName: z.string().optional(),
    receiverName: z.string().optional()
})

export type GiftDetails = z.infer<typeof GiftDetails>;

export const PaymentDetails = z.object({
    paymentMethod: z.enum(["stripe", "paypal", "payoneer", "paytabs"]),
    payment_id: z.string(),
    paymentStatus: z.enum(["success", "failed"])
})

export type PaymentDetails = z.infer<typeof PaymentDetails>;

export const CreateQuickDonationDto = z.object({
    donationId: z.string(),
    organizationId: z.string(),
    donorEmail: z.string(),
    donateAmount: z.string(),
    donatePurpose: z.string().optional(),
    regularity: z.enum(["Once", "Daily", "Weekly", "Monthly"]),
    donationType: z.enum(["Just", "Gift"]),
    giftDetail: GiftDetails,
    paymentDetail: PaymentDetails,
    donationDate: z.date()
})

export type CreateQuickDonationDto = z.infer<typeof CreateQuickDonationDto>;