import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "next-auth";
import { CartItem, Product } from "../../generated/prisma";
import axios from 'axios';
import { getSession, useSession } from "next-auth/react";

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

const cartInitialState: { cart: CartItem[], loading: boolean, error: any } = {
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
            const response = await axios.post('/api/cart/add', payload);

            return response.data
        }
        catch (err: any) {
            return rejectWithValue(err)
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


            const response = await axios.get(`/api/cart/${session.user.id}`);
            console.log("cart res:", response);
            return response.data;
        }
        catch (err: any) {
            console.error(err.response.data);
            return rejectWithValue(err.response.data)
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // ^ LOADING
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            // ! REJECTED
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
            // * FULFILLED
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.loading = false;
                state.error = null;
                state.cart = action.payload;
            })
    }
})

export default cartSlice;