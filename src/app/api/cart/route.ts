
import { getUser, res, withErrorHandler } from "../../../utils/serverUtils";
import { AddItemSchema } from "../../../lib/zod";
import { addToCart } from "../../../services/cartService";
import APIError from "../../../types/api";



// ADD TO CART

export async function postHandler(req: Request) {


    const rawBody = await req.json();

    const validation = AddItemSchema.safeParse(rawBody);

    if (!validation.success) throw new APIError("Body is missing 'quantity' field.", 400, 'NO_QUANTITY', validation.error)

    const body = validation.data

    const user = await getUser();

    const result = await addToCart(body, user);

    return res(201, 'Product has been successfully added to the cart.', result)



}


export const POST = withErrorHandler(postHandler)