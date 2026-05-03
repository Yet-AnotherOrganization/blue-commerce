import { AxiosResponse } from "axios";
import { CartItemWithProduct } from "./product";
import { z, ZodIssue } from 'zod';


export type GetCartResponse = AxiosResponse<{
    data: {
        createdAt: string,
        id: string,
        items: CartItemWithProduct[]
    }
}>

export class APIError extends Error {

    public statusCode: number;
    public errorCode: string;
    public status: 'FAIL' | 'ERROR';
    public details: string | string[] | undefined;


    constructor(message: string, statusCode: number, errorCode: string, details?: string | string[]) {
        super(message);

        this.statusCode = statusCode
        this.errorCode = errorCode
        this.status = `${statusCode}`.startsWith('4') ? 'FAIL' : 'ERROR';
        if (details) this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }


}


export default APIError;