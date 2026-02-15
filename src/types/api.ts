import { AxiosResponse } from "axios";
import { CartItemWithProduct } from "./product";



export type GetCartResponse = AxiosResponse<{
    data: {
        createdAt: string,
        id: string,
        items: CartItemWithProduct[]
    }
}>

export type CartPostBody = {
    method: "ADD" | "REMOVE"
    productId: string,
    quantity: number,
    metadata?: any
}