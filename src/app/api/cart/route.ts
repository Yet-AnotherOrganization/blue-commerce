
// ADD TO / REMOVE FROM CART

import { NextApiRequest } from "next";
import { findCartByUserId, getUser, res } from "../../../utils/serverUtils";
import { prisma } from "../../../lib/prisma";
import { AddItemDto, AddItemSchema, RemoveItemSchema } from "../../../lib/zod";
import { addToCart, removeFromCart } from "../../../services/cartService";

export async function POST(req: Request) {
    try {

        const rawBody = await req.json();

        const validation = AddItemSchema.safeParse(rawBody);

        if (!validation.success) {
            return res(400, 'An invalid object was sent', validation.error)
        }

        const body = validation.data

        const user = await getUser();

        const result = await addToCart(body, user);

        return res(201, 'Product has been successfully added to the cart.', result)

    }
    catch (err: unknown) {
        console.error(err);

        return res(
            err instanceof Error ? 400 : 500,
            err instanceof Error ? err.message : "Internal server error"
        );
    }

}


export async function DELETE(req: Request) {
    try {

        const rawBody = await req.json();

        let validation = RemoveItemSchema.safeParse(rawBody);

        if (!validation.success) {
            return res(400, 'An invalid object was sent', validation.error)
        }

        const body = validation.data

        // validate
        const user = await getUser();

        getCart

        const result = await removeFromCart(body);

        return res(201, 'Product has been successfully added to the cart.', result)

    }
    catch (err: unknown) {
        console.error(err);

        return res(
            err instanceof Error ? 400 : 500,
            err instanceof Error ? err.message : "Internal server error"
        );
    }

}