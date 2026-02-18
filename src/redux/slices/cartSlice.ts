import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "next-auth";
import { CartItem, Product } from "../../generated/prisma";
import axios, { AxiosResponse } from 'axios';
import { getSession, useSession } from "next-auth/react";
import { CartItemWithProduct } from "../../types/product";
import { GetCartResponse } from "../../types/api";

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

interface RemoveFromCartPayload {
    productId: string;
    quantity: number;
}

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload: AddToCartPayload, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/cart', { ...payload, method: 'ADD' });

            console.log("add to cart THUNK RES: ", response)

            return response.data.data.items
        }
        catch (err) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data)

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
            })
            // * FULFILLED
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItemWithProduct[]>) => {
                state.loading = false;
                state.error = null;
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
                state.error = action.payload
            })

            // * FULFILLED
            .addCase(fetchCartAsync.fulfilled, (state, action: PayloadAction<CartItemWithProduct[]>) => {
                state.loading = false;
                state.error = null;
                state.cart = action.payload;
            })

            // --------------------------------------------------------------------

            // ? EMPTY CART

            .addCase(emptyCart.pending, (state) => {
                state.loading = true
            })
    }
})

export default cartSlice;