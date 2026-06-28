import { ProductWithCategory, ProductWithSeller } from "@/types/product";
import axios from "axios"

export const getProduct = async (id: string): Promise<any> => {
    try {

        const request = await axios.get(`/api/product/${id}`)
        const product = request.data.data as (ProductWithCategory & ProductWithSeller);

        return product;
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            console.log(err.code, err.message);
        }
    }
}