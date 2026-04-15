import { prisma } from "@/lib/prisma";
import APIError from "@/types/api";
import { res, withErrorHandler } from "@/utils/serverUtils";

// RIGHT NOW THIS IS NOT USED

type HandlerParams = {
    params: { page: number, limit: number }
}

export async function getHandler(req: Request, { params }: HandlerParams) {

    const { page, limit } = params;

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages) throw new APIError('Page number cannot exceed max pages', 400, 'ERR_EXCEED_PAGE')

    const products = await prisma.product.findMany({
        skip: (page - 1) * limit | 0,
        take: limit | 20,
        orderBy: {
            createdAt: 'desc'
        }
    })

    return res(200, 'Products have been successfully sent.', products)
}


export const GET = withErrorHandler(getHandler)