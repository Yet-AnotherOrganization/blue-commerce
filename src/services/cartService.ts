import { User } from "next-auth";
import { prisma } from "../lib/prisma";
import { AddItemDto, RemoveItemDto } from "../lib/zod";
import { findCartByUserId, res } from "../utils/serverUtils";
import APIError from "../types/api";

export const addToCart = async (input: AddItemDto, user: User) => {
    const { productId } = input;


    let cart = await findCartByUserId(user.id);




    const quantity = input.quantity


    // ^ TRANSACTION BEGIN
    const result = await prisma.$transaction(async (tx) => {

        const product = await tx.product.findUnique({
            where: {
                id: productId
            }
        })

        if (!product) throw new APIError('Product is not found on the database.', 404, 'PRODUCT_NOT_FOUND')

        if (product.stock == 0) throw new APIError('The requested product is no longer on sale.', 409, 'PRODUCT_OUT_OF_STOCK');

        const existingItem = await tx.cartItem.findUnique({
            where:{
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId,
                }
            }
        })


        const updatedItem = await tx.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId,
                }
            },
            update: {
                quantity: { increment: quantity }
            },
            create: {
                cartId: cart.id,
                productId: productId,
                quantity: quantity
            },
            include:{
                product: true
            }
        });

        // Safety check post-write to enforce stock limits without sequential pre-reads
        if (updatedItem.quantity > product.stock) {
            throw new APIError('Insufficient stock for the requested quantity.', 409, 'PRODUCT_INSUFFICIENT_STOCK');
        }


        // ^ Get updated item back
        return updatedItem;
    })
    // ^ TRANSACTION OVER


    return {success: true, data: result};


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


    if (cartItemToBeModified.quantity + quantity > cartItemToBeModified.product.stock) throw new APIError('Not enough items in stock', 409, 'PRODUCT_INSUFFICIENT_STOCK')

    if((cartItemToBeModified.quantity + quantity) <= 0) throw new APIError('Quantity value cannot be less than one.', 400, 'PRODUCT_INVALID_QUANTITY')
    
        const modifiedItem = await prisma.cartItem.update({
        where: {
            id: cartItemId
        },
        data: {
            quantity: cartItemToBeModified.quantity + quantity
        },
    })

    return { success:true, data: modifiedItem }

}

export const removeItemFromCart = async (cartItemId: string) => {
    console.log("attempting to delete: ", cartItemId)
    await prisma.cartItem.delete({
        where: {
            id: cartItemId
        }
    })

    return {success:true }
}

export const emptyCartByUserId = async (userId: string) => {

    const cart = await findCartByUserId(userId);

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart?.id
        }
    })

    return {success: true}
}



// export const getCart = async (userId: string) => {
//     try{
        
//     }
//     catch(err){
//         console.log(err)
//     }
// }
