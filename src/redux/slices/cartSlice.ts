import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import { getSession } from "next-auth/react";
import { CartItemWithProduct, GuestCartItem } from "../../types/product";
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

export type CartUIItem = {
    id: string,
    quantity: number;
    product: {
        id: string;
        name: string;
        imageUrl: string;
        price: number;
        stock: number;
    }
}

const cartInitialState: { cart: CartUIItem[], loading: boolean, error: unknown } = {
    cart: [],
    loading: true,
    error: false
}

interface AddToCartPayload {
    productId: string;
    quantity?: number;
    // userEmail gibi verileri göndermene gerek yok, backend session'dan alacak!
}


export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload: AddToCartPayload, { rejectWithValue }) => {
        try {

            const user = (await getSession())?.user;

            if (user) {
                const sendPayload = { productId: payload.productId, quantity: payload.quantity ?? 1 }

                const response = await axios.post('/api/cart', { ...sendPayload, method: 'ADD' });
                return response.data.data.data
            }


            let cart: AddToCartPayload[] = JSON.parse(localStorage.getItem('cart') || '[]') || [];

            const index = cart.findIndex(item => {
                console.log(`${item.productId} \n\n\n COMPARE \n\n\n ${payload.productId}`)
                return (item.productId == payload.productId)});

            if (index == -1) cart = [...cart, payload];
            else {
                (cart[index] as GuestCartItem).quantity += 1
            }

            let updatedProduct = cart[index];

            localStorage.setItem('cart', JSON.stringify(cart))

            return updatedProduct;
        }
        catch (err) {

            if (axios.isAxiosError(err)) {
                console.log(err.response); return rejectWithValue(err.response?.data.message)
            }

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
            // get session manually
            const session = await getSession();

            // see if token exists
            if (!session) {
                return JSON.parse(localStorage.getItem('cart') || '[]') || []
            }

            console.log("fetch")

            let response: GetCartResponse = await axios.get(`/api/cart/${session.user.id}`);

            const items = response.data.data.items;

            return items;
        }
        catch (err: unknown) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.message)
            }
            return rejectWithValue(err instanceof Error ? err.message : err)
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
            return res.data.data.data;

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
                // // toast.error('Error: ' + action.payload) PURE REDUCER FIX
            })
            // * FULFILLED
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItemWithProduct>) => {
                state.loading = false;
                state.error = null;
                // // toast.success('Item was added to your cart.') PURE REDUCER FIX
                console.log("cart payloadı: ", action.payload)
                // 
                state.cart.map(item => console.log(item, '\n \n', action.payload));
                let foundItemId = state.cart.findIndex(item => item.product.id === action.payload.product.id)

                if (foundItemId != -1) state.cart[foundItemId] = action.payload;
                else {
                    state.cart.push(action.payload);
                }
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
                // // toast.error('Error: ' + action.payload) // PURE REDUCER FIX
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
                // // toast.error('Error: ' + action.payload) // PURE REDUCER FIX
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
                // toast.error('Error: ' + action.payload)
                console.log("Error: ", action.payload)
            })
            .addCase(decrementItem.fulfilled, (state, action: PayloadAction<CartItemWithProduct>) => {
                state.loading = false;
                state.cart.map((item) => console.log(item.id, '\n', action.payload))
                const changeIndex = state.cart.findIndex(item => item.id == action.payload.id)
                state.cart[changeIndex].quantity = action.payload.quantity
            })

            // ? Empty Cart

            .addCase(emptyCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(emptyCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log(action.payload)
                // toast.error('Error: ' + action.payload)
            })
            .addCase(emptyCart.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.cart = [];
            })
    }
})

export default cartSlice;