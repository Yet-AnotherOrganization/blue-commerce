import { changeItemQuantity, getCartFromUserId, removeItemFromCart } from "../../../../../services/cartService";
import APIError from "../../../../../types/api";
import { getUser, res } from "../../../../../utils/serverUtils";

type CartItemParams = {
    params: {
        itemId: string
    }
}

export async function PATCH(req: Request, { params }: CartItemParams) {
    try {

        const { itemId } = params;

        const body = await req.json();


        if (!itemId) throw new APIError("Body is missing 'itemId' field.", 400, 'NO_ITEM_ID')

        if (!body.quantity) throw new APIError("Body is missing 'quantity' field.", 400, 'NO_QUANTITY')

        // validate
        const user = await getUser();

        const cart = await getCartFromUserId(user.id)

        if (cart && (user.id !== cart.userId)) throw new APIError('This cart does not belong to your account.', 403, 'CART_UNAUTHORIZED')

        const result = await changeItemQuantity(itemId, body.quantity);

        return res(201, 'Item quantity has been successfully changed.', result)

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

export async function DELETE(req: Request, { params }: CartItemParams) {
    try {

        const { itemId } = params;

        console.log("\n\n params: \n\n", params)


        if (!itemId) {
            return res(400, 'Query lacks item ID.')
        }

        // validate if the user exists
        const user = await getUser();

        const cart = await getCartFromUserId(user.id)

        if (cart && (user.id !== cart.userId)) throw new Error('USER_NOT_AUTHORIZED')

        const result = await removeItemFromCart(itemId);

        return res(201, 'Action successful.', result)

    }
    catch (err: unknown) {
        console.error(err);

        return res(
            err instanceof Error ? 400 : 500,
            err instanceof Error ? err.message : "Internal server error"
        );
    }

}