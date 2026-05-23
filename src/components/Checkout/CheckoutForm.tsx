"use client";

import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { CheckoutSessionParams, createCheckoutSession } from "@/app/actions/stripe";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutForm({ priceId, userId, orderId }: CheckoutSessionParams) {
    // We fetch the clientSecret via the Server Action
    const fetchClientSecret = async () => {
        const { clientSecret } = await createCheckoutSession({ priceId, userId, orderId });
        return clientSecret as string;
    };

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
}