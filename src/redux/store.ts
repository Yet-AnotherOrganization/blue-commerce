import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartSlice from './slices/cartSlice';
import uiSlice from "./slices/uiSlice";
import favoriteSlice from "./slices/favoriteSlice";
import { listenerMiddleware } from "./listenerMiddleware";


export const makeStore = () => {

    return configureStore({
        reducer: {
            cartReducer: cartSlice.reducer,
            uiReducer: uiSlice.reducer,
            favoriteReducer: favoriteSlice.reducer
        },
        middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware)

    })

}


// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']