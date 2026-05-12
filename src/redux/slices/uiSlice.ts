import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartModalOpen: false,
    genericModalOpen: false,
    genericModalText: '',
    genericModalAction: null,
    theme: 'light',
}


const uiSlice = createSlice({
    name: "uiSlice",
    initialState,
    reducers: {
        openCartModal: (state,) => {
            state.cartModalOpen = true;
        },
        closeCartModal: (state,) => {
            state.cartModalOpen = false;
        },
        toggleCartModal: (state) => {
            state.cartModalOpen = !state.cartModalOpen
        },

        askGenericModal: (state, action) => {
            state.genericModalOpen = true;
            state.genericModalText = action.payload.text
            state.genericModalAction = action.payload.action
        }
        ,

        // THEME

        toggleTheme: (state,) => {
            state.theme = state.theme == 'light' ? 'dark' : 'light';
        }
    }
})


export default uiSlice;
export const { openCartModal, closeCartModal, toggleCartModal, toggleTheme } = uiSlice.actions;