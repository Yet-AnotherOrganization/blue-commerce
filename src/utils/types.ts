import { AxiosResponse } from "axios";

export type ProductType = {
    id: string,
    name: string,
    description: string,
    price: number,
    imageUrl: string,
    createdAt: string,
    updatedAt: string,
    categoryId: string,
    stock: number,
    sellerId: string
}

export type CartItemWithProduct = {
    id: string,
    cartId: string,
    product: ProductType
    updatedAt: string,
    quantity: number
}

export type GetCartResponse = AxiosResponse<{
    data: {
        createdAt: string,
        id: string,
        items: CartItemWithProduct[]
    }
}>