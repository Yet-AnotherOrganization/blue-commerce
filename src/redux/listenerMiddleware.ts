import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addToCart } from "./slices/cartSlice";
import { toast } from "sonner";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    actionCreator: addToCart.fulfilled,
    effect: () => { toast.success("Added to cart") },
});

listenerMiddleware.startListening({
    actionCreator: addToCart.rejected,
    effect: () => { toast.error("Couldn't add to cart") },
});