'use client';

import { createCheckoutSession } from "@/app/actions/stripe";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getSession, useSession } from "next-auth/react";
import { useCallback } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


type Props = {}

const CheckoutForm = ({ userId, orderId }: { priceId: string, userId: string, orderId: string }) => {

  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await createCheckoutSession({ userId, orderId });

      if (!response || !response.clientSecret) {
        throw new Error("Stripe checkout initialization failed: missing client secret.");
      }
      
      return response.clientSecret;
    }
    catch (error) {
      console.error("Failed to generate cart checkout session:", error);
      throw error;
    }
  }, [userId, orderId])

  return (
    <div id="checkout" className="my-4 min-h-[400px]">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default CheckoutForm