
import { ReadonlyURLSearchParams } from "next/navigation";
import { ProductParams } from "../constants/constants";
import { CartItemWithProduct } from "../types/product";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createProduct } from "@/app/actions/productActions";
import { toast } from "sonner";
import { FormEvent } from "react";

export const getActiveUserFromStorage = (): void => {
    if (typeof window !== 'undefined') {
        // Check if the code is running in a browser environment
    }
};

export const handleLogOut = async (): Promise<void> => {
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    localStorage.setItem('tempCart', JSON.stringify([]))
}

export const calculateTotalCost =
    (cart: CartItemWithProduct[]): number => {
        let price = 0;

        cart.map((item, i) => {
            price += item.product.price * item.quantity

            // console.log(price)
            // console.log(item.product.price)
            // console.log(item.quantity)
        })

        if (Number.isNaN(price)) console.log(price)

        return Number(price.toFixed(2));
    };


export const changePage = (searchParams: ReadonlyURLSearchParams, p: number, router: AppRouterInstance, pathname: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentPage = Number(params.get('page'))

    const newPage = currentPage + p >= 1 ? currentPage + p : 1
    params.set('page', String(newPage))
    router.replace(`${pathname}?${params.toString()}`)

}

export const handleProductCreateFormSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const product = Object.fromEntries(formData.entries())
    console.log(product)

    const file = formData.get('image') as File;

    if (file.size > 1024 * 1024 * 4) { toast.error('File size exceeds 4MB limit.'); return; }

    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']

    if (!allowedTypes.includes(file.type)) { toast.error('File type is invalid.'); return; }

    try {
        const response = await createProduct(formData);
        console.log("res: ", response)
        if (!response.success) throw new Error(response.message)
        toast.success('Product draft created successfully. Activate in products page.')
    }
    catch (err) {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Upload failed.')
        console.error("Upload failed: ", err)
    }

}