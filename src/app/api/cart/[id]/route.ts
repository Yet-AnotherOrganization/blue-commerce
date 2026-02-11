import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { res } from "../../../../utils/serverUtils";

export async function GET(req: Request, { params }: { params: { id: string } }) {

    try {
        const id = params.id

        console.log("ID is ZORT ", id)

        const cart = await prisma.cart.findUnique({
            where: {
                id
            }
        })

        if (!cart) return res(404, 'Cart with ID was not found')

        return res(200, 'Cart has been sent successfully.', cart )
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "There was an error during fetching cart.", data: err }, { status: 500 })
    }
}