import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { res } from "../../../../utils/serverUtils";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// REQUEST TO GET CART 
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return res(401, 'Please log in')
        }

        const requestedId = params.id;
        const currentUserId = session.user.id;

        if(requestedId !== currentUserId) return res(401, "You don't have access to this resource.")

        const id = params.id

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


        return res(200, 'Cart has been sent successfully.', cart)
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "There was an error during fetching cart.", data: err }, { status: 500 })
    }
}

// ADD TO CART

export async function POST(req: Request) {
    try {



    }
    catch (err) {
        console.log(err)
        return res(500, "An internal error has occurred", err)
    }
}