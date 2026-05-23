import { prisma } from "@/lib/prisma";
import APIError from "@/types/api";
import { stripe } from "@/utils/utils";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature")!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        throw new APIError(`Webhook Error: ${err.message}`, 400, 'WEBHOOK_PAYMENT_ERROR');
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;


        const userId = session.metadata?.userId;
        const orderId = session.metadata?.orderId;

        if (!userId || !orderId) {
            return Response.json(
                { message: "Missing metadata tags in session context", code: 'METADATA_ERROR' },
                { status: 400 }
            );
        }

        try {
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'COMPLETED',
                    stripeSessionId: session.id
                }
            })

            // 2. Clear user context if necessary (e.g., clearing the active cart)
            await prisma.cart.delete({
                where: { userId: userId }
            });
        }
        catch (err: unknown) {
            console.error(`Database fulfillment failed for session ${session.id}:`, err);

            // Returning a 500 tells Stripe to retry sending this specific webhook event later
            return Response.json(
                { message: "Internal fulfillment error, please try again later or contact with customer service.", code: 'SERVER_FULFILLMENT_ERROR' },
                { status: 500 }
            );
        }

        return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 200 });
}