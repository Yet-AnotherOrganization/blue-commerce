import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "next-auth";
import { CartItem, Product } from "../../generated/prisma";
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getSession, useSession } from "next-auth/react";
import { CartItemWithProduct } from "../../types/product";
import { GetCartResponse } from "../../types/api";
import { toast } from "sonner";

// const userSlice = createSlice({
//     name: "user",
//     initialState: {
//         user: null,
//         loading: true,
//         error: false,
//     },
//     reducers: {
//         setUser: (state, action: PayloadAction<User>) => { 

//         }
//     }
// })

const cartInitialState: { cart: CartItemWithProduct[], loading: boolean, error: any } = {
    cart: [],
    loading: true,
    error: false
}

interface AddToCartPayload {
    productId: string;
    quantity: number;
    // userEmail gibi verileri göndermene gerek yok, backend session'dan alacak!
}


export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload: AddToCartPayload, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/cart', { ...payload, method: 'ADD' });

            return response.data.data.data.items
        }
        catch (err) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data.message)

            if (err instanceof Error)
                return rejectWithValue(err.message)

            else rejectWithValue('Unknown error during addToCart request.')
        }

    }
)

export const fetchCartAsync = createAsyncThunk(
    'cart/fetchCartAsync',
    async (_, { rejectWithValue }) => {
        try {
            // 1. Session'ı manuel çek (Promise döner)
            const session = await getSession();

            // 2. Token var mı kontrol et
            if (!session) {
                return rejectWithValue("Oturum bulunamadı");
            }


            let response: GetCartResponse = await axios.get(`/api/cart/${session.user.id}`);

            const items = response.data.data.items;


            return items;
        }
        catch (err: any) {
            console.error(err);
            return rejectWithValue(err)
        }
    }
)

export const emptyCart = createAsyncThunk(
    'cart/emptyCart',
    async (_, { rejectWithValue }) => {
        try {

            // TODO
            return await axios.delete('/api/cart')

        }
        catch (err: unknown) {

            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data.message)

            if (err instanceof Error)
                return rejectWithValue(err.message)

            else rejectWithValue('Unknown error during removeItem request.')
        }


    })

export const removeItem = createAsyncThunk('cart/removeItem',
    async (payload: string, { rejectWithValue }) => {

        try {
            console.log("The item wanted to delete:", payload)

            const res = await axios.delete(`/api/cart/items/${payload}`);


            return;

        }
        catch (err: unknown) {

            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data.message)

            if (err instanceof Error)
                return rejectWithValue(err.message)

            else rejectWithValue('Unknown error during removeItem request.')
        }

    })

export const decrementItem = createAsyncThunk('cart/decrementItem',
    async (payload: string, { rejectWithValue }) => {

        try {
            console.log("The item wanted to delete:", payload)

            const res = await axios.patch(`/api/cart/items/${payload}`, { quantity: -1 });


            console.log('changeItemRes: ', res.data)
            return res.data.data;

        }
        catch (err: unknown) {

            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data.message)

            if (err instanceof Error)
                return rejectWithValue(err.message)

            else rejectWithValue('Unknown error during decrementItem request.')
        }
    })


const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // ? ADD TO CART

            // ^ LOADING
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            // ! REJECTED
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
                console.log(action.payload)
                toast.error('Error: ' + action.payload)
            })
            // * FULFILLED
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItemWithProduct[]>) => {
                state.loading = false;
                state.error = null;
                toast.success('Item was added to your cart.')
                console.log("cart payloadı: ", action.payload)
                state.cart = action.payload;
            })

            // -------------------------------------------------------------------

            // ? FETCH CART

            // ^ LOADING
            .addCase(fetchCartAsync.pending, (state) => {
                state.loading = true;
            })

            // ! REJECTED
            .addCase(fetchCartAsync.rejected, (state, action) => {
                state.loading = false;
                toast.error('Error: ' + action.payload)
                state.error = action.payload
            })

            // * FULFILLED
            .addCase(fetchCartAsync.fulfilled, (state, action: PayloadAction<CartItemWithProduct[]>) => {
                state.loading = false;
                state.error = null;
                state.cart = action.payload;
            })

            // ---------------------------------------------------------------------

            // ? Remove

            .addCase(removeItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
                toast.error('Error: ' + action.payload)
                console.log(action.payload)
            })
            .addCase(removeItem.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const removedItemId = action.meta.arg
                state.cart = state.cart.filter((item) => item.id !== removedItemId)

            })

            // ? Decrement

            .addCase(decrementItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(decrementItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error('Error: ' + action.payload)
                console.log("Error: ", action.payload)
            })
            .addCase(decrementItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = state.cart.map((item) => {

                    console.log("currentItem: ", item)

                    console.log("\n\n searchedItem: ", action.payload)

                    return item.id == action.payload?.id ? { ...item, quantity: action.payload.quantity } : item
                })
            })

            // ? Empty Cart

            .addCase(emptyCart.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(emptyCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log(action.payload)
                toast.error('Error: ' + action.payload)
            })
            .addCase(emptyCart.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.cart = [];
            })
    }
})

export default cartSlice;