
import { ReadonlyURLSearchParams } from "next/navigation";
import { CartItemWithProduct, GuestCartItem } from "../types/product";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createProduct } from "@/app/actions/productActions";
import { toast } from "sonner";
import { FormEvent } from "react";
import { CartUIItem } from "@/redux/slices/cartSlice";
import { Product } from "@/generated/prisma";

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

async function hydrateGuestCart(
    guestCart: GuestCartItem[]
): Promise<CartUIItem[]> {
    const products: Product[] = await Promise.all(
        guestCart.map(item => fetchProduct(item.productId))
    );

    return guestCart.map((item, i) => ({
        quantity: item.quantity,
        product: products[i],
    }));
}

export const calculateTotalCost =
    (cart: CartUIItem[]): number => {
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

export const handleProductCreateFormSubmit = async (e: FormEvent<HTMLFormElement>, router?: AppRouterInstance) => {

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
        if (router) router.push('/admin/product')
        return response;

    }
    catch (err) {
        if (err instanceof Error) toast.error(`${err.name}: ${err.message}`)
        else toast.error('Upload failed.')
        console.error("Upload failed", err)
    }

}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 1000) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const debounced = (...args: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }

    debounced.cancel = () => clearTimeout(timeoutId);

    return debounced;
}

export const toBase64 = (str: string) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str);

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e2e8f0" offset="20%" />
      <stop stop-color="#f1f5f9" offset="50%" />
      <stop stop-color="#e2e8f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#e2e8f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;