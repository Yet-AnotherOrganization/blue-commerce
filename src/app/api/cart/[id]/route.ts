import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { findCartByUserId, getUser, res } from "../../../../utils/serverUtils";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextApiRequest } from "next";

// REQUEST TO GET CART 
export async function GET(req: NextApiRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUser();


        const requestedId = params.id;
        const currentUserId = user.id;

        if (requestedId !== currentUserId) return res(403, "You don't have access to this resource.")

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

        if (!cart) return res(404, 'Cart with ID was not found')

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


        return res(200, 'Cart has been successfully sent.', cart)
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "An error has occurred while fetching cart.", data: err }, { status: 500 })
    }
}
