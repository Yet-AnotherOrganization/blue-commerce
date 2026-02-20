
import { getUser, res } from "../../../utils/serverUtils";
import { AddItemSchema } from "../../../lib/zod";
import { addToCart } from "../../../services/cartService";
import APIError from "../../../types/api";



// ADD TO CART

export async function POST(req: Request) {
    try {

        const rawBody = await req.json();

        const validation = AddItemSchema.safeParse(rawBody);

        if (!validation.success) throw new APIError("Body is missing 'quantity' field.", 400, 'NO_QUANTITY', validation.error)

        const body = validation.data

        const user = await getUser();

        const result = await addToCart(body, user);

        return res(201, 'Product has been successfully added to the cart.', result)

    }
    catch (err: unknown) {
        console.error(err);

        if (err instanceof APIError) {
            return res(err.statusCode, err.message, err.details)
        }

        return res(
            err instanceof Error ? 400 : 500,
            err instanceof Error ? err.message : "Internal server error"
        );
    }

}


