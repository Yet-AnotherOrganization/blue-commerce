import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { thunkWrapper } from "../../utils/utils"
import axios from "axios"
import { Favorite, Product } from "../../generated/prisma"
import { toast } from "sonner"

interface StateType {
    error: unknown,
    loading: boolean
}
const initialState: StateType = {
    error: null,
    loading: false
}

interface FavoriteRecord {
    id: string;        // Favori işlem ID'si
    ownerId: string;
    productId: string; // Eşleşme yapacağımız asıl ID
}

const addToFavoritesLogic = async (productId: string) => {
    const res = await axios.post('/api/favorite', {
        productId
    })

    return res.data.data
}

const fetchFavoritesLogic = async () => {
    const res = await axios.get('/api/favorite');

    return res.data.data
}

const removeFromFavoritesLogic = async (productId: string) => {

    const res = await axios.delete(`/api/favorite/${productId}`)

    return productId
}

export const addToFavorites = thunkWrapper<string>('favorites/addToFavorites', addToFavoritesLogic)

export const fetchFavorites = thunkWrapper<void>('favorites/fetchFavorites', fetchFavoritesLogic)

export const removeFromFavorites = thunkWrapper<string>('favorites/removeFromFavorites', removeFromFavoritesLogic)


const favoritesAdapter = createEntityAdapter<FavoriteRecord, string>({
    selectId: (favorite: Favorite) => { return favorite.productId }
}
);

const favoriteSlice = createSlice({
    name: "favorites",
    initialState: favoritesAdapter.getInitialState(initialState),
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
            console.log("eklenen veri: ", action.payload)
            state.error = null;
            favoritesAdapter.addOne(state, action.payload)
        })

        // FETCH FAVS

        builder.addCase(fetchFavorites.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        builder.addCase(fetchFavorites.rejected, (state, action) => {

            state.loading = false;
            toast.error('Error: ' + action.payload)
            state.error = action.payload
        })
        builder.addCase(fetchFavorites.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            favoritesAdapter.setAll(state, action.payload)
        })

        // REMOVE FROM FAVS

        builder.addCase(removeFromFavorites.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        builder.addCase(removeFromFavorites.rejected, (state, action) => {

            state.loading = false;
            toast.error('Error: ' + action.payload)
            state.error = action.payload
        })
        builder.addCase(removeFromFavorites.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            toast.success('Item removed from wishlist.')
            favoritesAdapter.removeOne(state, action.payload)
        })
    }
})

export default favoriteSlice

export const {
    selectAll: selectAllFavorites,
    selectById: selectFavoriteById,
} = favoritesAdapter.getSelectors((state: any) => state.favoriteReducer)