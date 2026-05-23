import { createCheckoutSession } from '@/app/actions/stripe';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/utils/serverUtils';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

export default async function CheckoutPage(props: Props) {
    const user = await getUser();
    const userId = user.id;

    if (!userId) redirect('/login');

    const cart = await prisma.cart.findFirst({
        where: { userId: userId },
        include: {
            items: {
                include: { product: true }
            }
        },
    });

    if (!cart || cart.items.length === 0) {
        redirect("/cart"); // Can't checkout without any items
    }

    const totalAmount = cart.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
    );

    const activeOrder = await prisma.$transaction(async (tx) => {
        // Delete any stale, unpaid pending orders to prevent processing wrong items/prices
        await tx.order.deleteMany({
            where: {
                ownerId: userId,
                status: "PENDING"
            }
        });

        // Create the new accurate order mirror matching the current cart items precisely
        const newOrder = await tx.order.create({
            data: {
                ownerId: userId,
                totalAmount: totalAmount,
                status: "PENDING",
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        });

        return newOrder;
    });


    return (
        <main className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Secure Checkout</h1>
            <CheckoutForm
                userId={userId}
                orderId={activeOrder.id}
            />
        </main>
    )
}