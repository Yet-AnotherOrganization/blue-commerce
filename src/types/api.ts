import { AxiosResponse } from "axios";
import { CartItemWithProduct } from "./product";
import {z} from 'zod';


export type GetCartResponse = AxiosResponse<{
    data: {
        createdAt: string,
        id: string,
        items: CartItemWithProduct[]
    }
}>


