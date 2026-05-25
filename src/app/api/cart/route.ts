
import { getUser, res, withErrorHandler } from "../../../utils/serverUtils";
import { AddItemSchema } from "../../../lib/zod";
import { addToCart, emptyCartByUserId } from "../../../services/cartService";
import { findCartByUserId} from '../../../utils/serverUtils'
import APIError from "../../../types/api";


// ADD TO CART

async function postHandler(req: Request):Promise<Response> {


    const rawBody = await req.json();

    const validation = AddItemSchema.safeParse(rawBody);

    if (!validation.success) throw new APIError("Body is missing 'quantity' field.", 400, 'NO_QUANTITY', validation.error.toString())

    const body = validation.data

    const user = await getUser();

    const result = await addToCart(body, user);

    return res(201, 'Product has been successfully added to the cart.', result)



}

async function deleteHandler(req: Request) {
    const user = await getUser();

    const cart = await findCartByUserId(user.id)

    if (!cart) throw new APIError('No cart related to this user exists.', 404, 'CART_NOT_FOUND')

    if (user.id != cart.userId) throw new APIError("You don't have access to this resource.", 403, 'CART_FORBIDDEN')

    await emptyCartByUserId(user.id);

    return res(204, 'Deleted');
}

export const POST = withErrorHandler(postHandler)
export const DELETE = withErrorHandler(deleteHandler);
