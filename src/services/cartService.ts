import { User } from "next-auth";
import { prisma } from "../lib/prisma";
import { CartItemDto } from "../lib/zod";
import { findCartByUserId, res } from "../utils/serverUtils";
import { getUser } from "../utils/serverUtils";

export const addToCart = async (input: CartItemDto, user: User) => {


    const { method, productId, quantity } = input;


    let cart = await findCartByUserId(user.id);

    // if the cart doesn't exist, then create it.
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId: user.id,
            }
        })
    }

    switch (method) {
        case 'ADD':

            const product = await prisma.product.findUnique({
                where: {
                    id: productId
                }
            })


            // ^ TRANSACTION BEGIN
            const result = await prisma.$transaction(async (tx) => {

                if (!product) throw new Error('The requested product is no longer on sale.');

                const existingItem = await tx.cartItem.findUnique({
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId: product.id
                        }
                    }
                })

                let newQuantity = existingItem ? existingItem.quantity : 0 + quantity;

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
                            increment: quantity
                        }
                    },
                    create: {
                        cartId: cart.id,
                        productId: product.id,
                        quantity: quantity
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
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        price: true,
                                        imageUrl: true,
                                        description: false
                                    }
                                }
                            }
                        }
                    }
                })

                return finalCart;
            })
            // ^ TRANSACTION OVER
            return result;
        case "REMOVE":
            return;
        default:
            throw new Error("This request's body must be sent with a 'method' key with a value of ADD or REMOVE.")
    }
}