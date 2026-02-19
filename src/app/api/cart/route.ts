
// ADD TO / REMOVE FROM CART

import { NextApiRequest } from "next";
import { findCartByUserId, getUser, res } from "../../../utils/serverUtils";
import { prisma } from "../../../lib/prisma";
import { CartItemDto, CartItemSchema } from "../../../lib/zod";
import { addToCart } from "../../../services/cartService";

export async function POST(req: Request) {
    try {

        const rawBody = await req.json();

        const validation = CartItemSchema.safeParse(rawBody);

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