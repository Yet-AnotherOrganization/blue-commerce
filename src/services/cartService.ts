import { User } from "next-auth";
import { prisma } from "../lib/prisma";
import { AddItemDto, RemoveItemDto } from "../lib/zod";
import { findCartByUserId, res } from "../utils/serverUtils";
import { getUser } from "../utils/serverUtils";
import { Cart } from "../generated/prisma";

export const addToCart = async (input: AddItemDto, user: User) => {
    const { productId } = input;


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


}

export const changeItemQuantity = async (cartItemId: string, quantity: number) => {

    const cartItemToBeModified = await prisma.cartItem.findUnique({
        where: {
            id: cartItemId
        },
        include: {
            product: true
        }
    })

    if (!cartItemToBeModified) throw new Error('This product is not inside this cart.')


    if (cartItemToBeModified.quantity + quantity > cartItemToBeModified.product.stock) throw new Error('There is not enough of this item in stocks, current stock: ' + cartItemToBeModified.product.stock)


    const modifiedItem = await prisma.cartItem.update({
        where: {
            id: cartItemId
        },
        data: {
            quantity: cartItemToBeModified.quantity + quantity
        },
    })

    return { ...modifiedItem }

}

export const removeItemFromCart = async (cartItemId: string) => {
    console.log(cartItemId)
    await prisma.cartItem.delete({
        where: {
            id: cartItemId
        }
    })

    return { result: 'DELETED' }
}

export const getCartFromUserId = async (userId: string): Promise<Cart | void> => {
    try {

        const cart = await prisma.cart.findUnique({
            where: {
                userId
            }
        })

        if (!cart) throw new Error('CART_NOT_FOUND')

        return cart

    }
    catch (err) {
        console.log(err)
        return;
    }
}