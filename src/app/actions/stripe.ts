"use server";

import APIError from "@/types/api";
import { getStripe } from "@/utils/utils";

import { headers } from "next/headers";

export interface CheckoutSessionParams {
  priceId: string;
  userId: string;
  orderId: string;
}

export async function createCheckoutSession({priceId, userId, orderId}:CheckoutSessionParams) {
  const origin = (await headers()).get("origin");

  if(!origin) throw new APIError('Unable to determine request origin', 400, 'REQ_NO_ORIGIN')

    const stripe = getStripe();

  const session = await stripe?.checkout.sessions.create({
    ui_mode: 'embedded_page', // This enables the 2026 Embedded UI
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
        userId,
        orderId
    }
  });

  return { clientSecret: session.client_secret };
}