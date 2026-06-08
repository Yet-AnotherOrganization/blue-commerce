"use server";

import { prisma } from "@/lib/prisma";
import APIError from "@/types/api";
import { getStripe } from "@/utils/utils";

import { headers } from "next/headers";

export interface CheckoutSessionParams {
  userId: string;
  orderId: string;
}

export async function createCheckoutSession({ userId, orderId }: CheckoutSessionParams) {
  const origin = (await headers()).get("origin");

  if (!origin) throw new APIError('Unable to determine request origin', 400, 'REQ_NO_ORIGIN')


  const cartItems = await prisma.cartItem.findMany({
    where: { cart: { userId } },
    include: { product: true }
  });

  if (!cartItems || cartItems.length === 0) {
    throw new APIError('Your cart is empty', 400, 'EMPTY_CART');
  }

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        images: [item.product.imageUrl],
        description: item.product.description || undefined,
      },
      unit_amount: Math.round(Number(item.product.price) * 100),
    },
    quantity: item.quantity,
  }));

  const stripe = getStripe();

  const session = await stripe?.checkout.sessions.create({
    ui_mode: 'embedded_page', // This enables the 2026 Embedded UI
    line_items: lineItems,
    mode: 'payment',
    return_url: `${origin}/checkout/${orderId}`,
    metadata: {
      userId,
      orderId
    }
  });

  return { clientSecret: session.client_secret };
}