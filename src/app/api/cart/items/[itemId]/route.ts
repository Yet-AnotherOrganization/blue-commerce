import { decrementItemQuantity, getCartFromUserId, removeItemFromCart } from "../../../../../services/cartService";
import { getUser, res } from "../../../../../utils/serverUtils";

type CartItemParams = {
    params: {
        itemId: string
    }
}

export async function PATCH(req: Request, { params }: CartItemParams) {
    try {

        const { itemId } = params;


        if (!itemId) {
            return res(400, 'Query lacks item ID.')
        }

        // validate
        const user = await getUser();

        const cart = await getCartFromUserId(user.id)

        if (cart && (user.id !== cart.userId)) throw new Error('USER_NOT_AUTHORIZED')

        const result = await decrementItemQuantity(itemId);

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

export async function DELETE(req: Request, { params }: CartItemParams) {
    try {

        const { itemId } = params;

        console.log("\n\n params: \n\n", params)


        if (!itemId) {
            return res(400, 'Query lacks item ID.')
        }

        // validate
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