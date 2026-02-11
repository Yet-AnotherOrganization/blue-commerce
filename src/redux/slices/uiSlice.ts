import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartModalOpen: false,
    theme: 'light',
}


const uiSlice = createSlice({
    name: "uiSlice",
    initialState,
    reducers: {
        openModal: (state,) => {
            state.cartModalOpen = true;
        },
        closeModal: (state,) => {
            state.cartModalOpen = false;
        },
        toggleModal: (state,) => {
            state.cartModalOpen = !state.cartModalOpen
        },

        // THEME

        toggleTheme: (state,) => {
            state.theme = state.theme == 'light' ? 'dark' : 'light';
        }
    }
})


export default uiSlice;
export const { openModal, closeModal, toggleModal, toggleTheme } = uiSlice.actions;