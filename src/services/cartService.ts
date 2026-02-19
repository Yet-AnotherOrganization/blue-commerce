import { User } from "next-auth";
import { prisma } from "../lib/prisma";
import { CartItemDto } from "../lib/zod";
import { findCartByUserId, res } from "../utils/serverUtils";
import { getUser } from "../utils/serverUtils";

export const addToCart = async (input: CartItemDto, user: User) => {



    const { method, productId } = input;


    let cart = await findCartByUserId(user.id);

    // if the cart doesn't exist, then create it.
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId: user.id,
            }
        })
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })


    switch (method) {
        case 'ADD':
            const quantity = input.quantity
            // ^ TRANSACTION BEGIN
            const result = await prisma.$transaction(async (tx) => {

                if (!product) throw new Error('Product is not found on the database.')


                if (product.stock == 0) throw new Error('The requested product is no longer on sale.');

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
        case "DEC":

            const cartItem = await prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: productId
                    }
                }
            })

            console.log("\n\n cartItem: \n", cartItem);

            console.log('\n \n cartid:', cart.id, '\n\n prodid:', productId)

            if (!cartItem) throw new Error('ITEM_NOT_FOUND')

            if (cartItem.quantity > 1) {

                // update the item and get the updated version without the description

                const updatedItem = await prisma.cartItem.update({
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId: productId
                        }
                    },
                    data: {
                        quantity: {
                            decrement: 1
                        }
                    },
                    include: {
                        product: {
                            omit: {
                                description: true
                            }
                        }
                    }
                })

                return { ...updatedItem, result: 'DECREMENT' };
            }
            else {

                const deletedItem = await prisma.cartItem.delete({
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId: productId
                        }
                    }
                })

                return { id: deletedItem.id, result: 'REMOVE' }
            }

        default:
            throw new Error("NO_METHOD_(ADD/DEC)")
    }
}