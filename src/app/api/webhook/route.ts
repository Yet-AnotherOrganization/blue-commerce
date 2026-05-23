import { prisma } from "@/lib/prisma";
import APIError from "@/types/api";
import { getStripe } from "@/utils/utils";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature")!;

    const stripe = getStripe();

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return Response.json(
            { message: `Webhook Error: ${err.message}`, code: 'WEBHOOK_PAYMENT_ERROR' },
            { status: 400 }
        );;
    }
    console.log('EVENT: ', event)
    // Handle the event
    if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded" || event.type === 'checkout.session.async_payment_succeeded') {
        const sessionOrIntent = event.data.object as any;

        console.log('CHECKOUT COMPLETE')
        // payment_intent objects store metadata directly at the root, just like checkout.session
        const userId = sessionOrIntent.metadata?.userId;
        const orderId = sessionOrIntent.metadata?.orderId;

        if (!userId || !orderId) {
            return Response.json(
                { message: "Missing metadata tags in session/intent context", code: 'METADATA_ERROR' },
                { status: 400 }
            );
        }

        try {

            // Use a Prisma transaction to make sure BOTH operations succeed together
            await prisma.$transaction(async (tx) => {
                console.log('TRANSACTION CHECKOUT')
                await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'COMPLETED',
                        stripeSessionId: sessionOrIntent.id
                    }
                });
                await tx.cart.update({
                    where: { userId: userId },
                    data: {
                        items: { set: [] }
                    }
                })
            }
            );

            console.log(`Order ${orderId} successfully completed via webhook event: ${event.type}`);
        } catch (err: unknown) {
            console.error(`Database fulfillment failed for event ${event.id}:`, err);
            return Response.json(
                { message: "Internal fulfillment error", code: 'SERVER_FULFILLMENT_ERROR' },
                { status: 500 }
            );
        }

        return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 200 });
}