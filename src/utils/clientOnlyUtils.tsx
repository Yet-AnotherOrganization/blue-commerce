
import { ProductParams } from "../constants/constants";
import { CartItemWithProduct } from "./types";

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
        })

        return price;
    };