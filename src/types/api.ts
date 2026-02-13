import { AxiosResponse } from "axios";
import { CartItemWithProduct } from "./product";



export type GetCartResponse = AxiosResponse<{
    data: {
        createdAt: string,
        id: string,
        items: CartItemWithProduct[]
    }
}>

