
import { ReadonlyURLSearchParams } from "next/navigation";
import { ProductParams } from "../constants/constants";
import { CartItemWithProduct } from "../types/product";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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


export const changePage = (searchParams: ReadonlyURLSearchParams, p: number, router:AppRouterInstance, pathname:string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentPage = Number(params.get('page'))

    const newPage = currentPage + p >= 1 ? currentPage + p : 1
    params.set('page', String(newPage))
    router.replace(`${pathname}?${params.toString()}`)

}