import { prisma } from "@/lib/prisma";
import { res, withErrorHandler } from "@/utils/serverUtils";
import { NextResponse } from "next/server";

type HandlerProps = {
    params: Promise<{ id: string }>
}

const getHandler = async (req: Request, { params }: HandlerProps): Promise<NextResponse | Response> => {

    const { id } = await params;

    const product = await prisma.product.findFirst({
        where: {
            id,
        },
        include: {
            category: true,
            seller: true,
            reviews: true,
        }
    })

    return res(200, 'Successfully fetched item', product)
}


export const GET = withErrorHandler(getHandler);