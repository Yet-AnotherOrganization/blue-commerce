import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import APIError from "../../../../types/api";
import { getUser, res, withErrorHandler } from "../../../../utils/serverUtils"

type HandlerParams = {
    params: { id: string }
}

const deleteHandler = async (req: Request, { params }: HandlerParams) => {

    const user = await getUser();

    const itemToDelete = await prisma.favorite.delete({
        where: {
            ownerId_productId: {
                ownerId: user.id,
                productId: params.id
            }
        }
    })

    if (!itemToDelete) throw new APIError('This product is not in your favorites', 404, 'ERR_FAVORITE_NOT_FOUND')

    return res(204, 'Removed from favorites.', itemToDelete.productId)
}

export const DELETE = withErrorHandler(deleteHandler)