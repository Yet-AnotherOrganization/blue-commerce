import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { thunkWrapper } from "../../utils/utils"
import axios from "axios"
import { Product } from "../../generated/prisma"
import { toast } from "sonner"

interface StateType {
    error: any,
    favorites: Product[],
    loading: boolean
}
const initialState: StateType = {
    favorites: [],
    error: null,
    loading: false
}

const addToFavoritesLogic = async (productId: string, { rejectWithValue }: any) => {
    const res = await axios.post('/api/favorite', {
        productId
    })

    console.log(res)

}

const addToFavorites = thunkWrapper('favorites/addToFavorites', addToFavoritesLogic)


const favoriteSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addToFavorites.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        builder.addCase(addToFavorites.rejected, (state, action) => {

            state.loading = false;
            toast.error('Error: ' + action.payload)
            state.error = action.payload
        })
        builder.addCase(addToFavorites.fulfilled, (state, action) => {
            state.loading = false;
            toast.success('Item was successfully added to the wishlist.')
            state.error = null;
            if (!state.favorites.find((item) => item.id === action.payload.id)) {
                state.favorites.push(action.payload)
            }
        })
    }
})