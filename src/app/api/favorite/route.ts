import { NextResponse } from "next/server";
import { getUser, withErrorHandler } from "../../../utils/serverUtils"
import APIError from "../../../types/api";
import { prisma } from "../../../lib/prisma";

const postHandler = async (req: Request) => {

    const user = await getUser();

    if (!user) throw new APIError('No session found, please log in again.', 401, 'ERR_UNAUTHORIZED')

    const { productId } = await req.json();

    if (!productId) throw new APIError('Product ID was not given.', 400, 'ERR_NO_PRODUCTID')

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })

    if (!product) throw new APIError('Product with given ID was not found', 404, 'ERR_NO_PRODUCT')

    const favoriteItem = await prisma.favorite.upsert({
        where: {
            ownerId_productId: {
                ownerId: user.id,
                productId: productId
            }
        },
        update: {},
        create: {
            ownerId: user.id,
            productId
        }
    })

    return NextResponse.json({ success: true, message: 'Item successfully added to favorites', data: favoriteItem })

}


export const POST = withErrorHandler(postHandler)