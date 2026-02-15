
// ADD TO CART

import { NextApiRequest } from "next";
import { findCartByUserId, getUser, res } from "../../../utils/serverUtils";
import { CartPostBody } from "../../../types/api";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {

        const body = (await req.json()) as CartPostBody;

        const user = await getUser();

        let cart = await findCartByUserId(user.id);

        // if the cart doesn't exist, then create it.
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: user.id,
                }
            })
        }

        switch (body.method) {
            case 'ADD':
                const product = await prisma.product.findUnique({
                    where: {
                        id: body.productId
                    }
                })


                // ^ TRANSACTION BEGIN
                const result = await prisma.$transaction(async (tx) => {

                    if (!product) throw new Error('The requested product is no longer on sale.');

                    const existingItem = await tx.cartItem.findUnique({
                        where:{
                            cartId_productId: {
                                cartId: cart.id,
                                productId: product.id
                            }
                        }
                    })

                    let newQuantity = existingItem ? existingItem.quantity : 0 + body.quantity;

                    if (newQuantity > product.stock) throw new Error("The number of products you requested does not exist in stocks, current stock: " + product.stock);


                    await tx.cartItem.upsert({
                        where: {
                            cartId_productId: {
                                cartId: cart.id,
                                productId: product.id
                            }
                        },
                        update: {
                            quantity: {
                                increment: body.quantity
                            }
                        },
                        create: {
                            cartId: cart.id,
                            productId: product.id,
                            quantity: body.quantity
                        }
                    })



                    // ^ Get updated cart back

                    const finalCart = await tx.cart.findUnique({
                        where: {
                            id: cart.id
                        },
                        include: {
                            items: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    })

                    return finalCart;
                })
                // ^ TRANSACTION OVER

                return res(201, 'Product has successfully been added to the cart.', result)
            case "REMOVE":
                return;
            default:
                return res(400, "This request's body must be sent with a 'method' key with a value of ADD or REMOVE.")
        }

    }
    catch (err: unknown) {
        console.error(err);

        return res(
            err instanceof Error ? 400 : 500,
            err instanceof Error ? err.message : "Internal server error"
        );
    }

}