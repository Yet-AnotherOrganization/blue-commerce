import { prisma } from "../../../../lib/prisma";
import { getUser, res, withErrorHandler } from "../../../../utils/serverUtils";
import APIError from "../../../../types/api";

type HandlerParams = {
    params: { id: string }
}

// REQUEST TO GET CART 
export async function getHandler(req: Request, { params }: HandlerParams) {
    const user = await getUser();


    const requestedId = params.id;
    const currentUserId = user.id;

    if (requestedId !== currentUserId) throw new APIError('This cart does not belong to you.', 403, 'CART_FORBIDDEN')

    const cart = await prisma.cart.findUnique({
        where: {
            userId: requestedId
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    })

    if (!cart) throw new APIError('Cart with the specified ID was not found', 404, 'CART_NOT_FOUND')

    // transform to make ready
    cart.items.map((item, index) => ({
        ...item,
        product:
        {
            ...item.product,
            price: item.product.price.toNumber(),
            createdAt: item.product.createdAt.toISOString(),
            updatedAt: item.product.updatedAt.toISOString()
        }
    }
    ))

    console.log('sent cart: ', cart.items[0])

    return res(200, 'Cart has been successfully sent.', cart)
}



export const GET = withErrorHandler(getHandler);