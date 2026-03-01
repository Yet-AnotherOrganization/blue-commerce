import { User } from "next-auth";
import { prisma } from "../lib/prisma";
import { AddItemDto, RemoveItemDto } from "../lib/zod";
import { findCartByUserId, res } from "../utils/serverUtils";
import { getUser } from "../utils/serverUtils";
import { Cart } from "../generated/prisma";
import APIError from "../types/api";

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

        if (!product) throw new APIError('Product is not found on the database.', 404, 'PRODUCT_NOT_FOUND')


        if (product.stock == 0) throw new APIError('The requested product is no longer on sale.', 409, 'PRODUCT_OUT_OF_STOCK');

        const existingItem = await tx.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: product.id
                }
            }
        })

        let newQuantity = existingItem ? existingItem.quantity : 0 + quantity;

        if (newQuantity > product.stock) throw new APIError('Insufficient stock for the requested quantity. ', 409, 'PRODUCT_INSUFFICIENT_STOCK');


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

    if (!cartItemToBeModified) throw new APIError('This product is not inside the specified cart.', 404, 'NOT_IN_CART')


    if (cartItemToBeModified.quantity + quantity > cartItemToBeModified.product.stock) throw new APIError('Not enough items in stock', 401, 'SESSION_EXPIRED', { stock: cartItemToBeModified.product.stock })


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



// export const getCart = async (userId: string) => {
//     try{
        
//     }
//     catch(err){
//         console.log(err)
//     }
// }
