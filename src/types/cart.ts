import { Product } from "@/generated/prisma";
import { Serialized } from "./product";

export type CartItemWithProduct = {
    id: string,
    cartId?: string,
    product: Serialized<Product>
    updatedAt?: string,
    quantity: number
}

export type GuestCartItem = {
    productId: string;
    quantity: number;
}