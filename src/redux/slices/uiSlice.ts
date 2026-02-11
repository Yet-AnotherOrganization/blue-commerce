import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartModalOpen: false,
    theme: 'light',
}


const uiSlice = createSlice({
    name: "uiSlice",
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.cartModalOpen = true;
        },
        closeModal: (state, action) => {
            state.cartModalOpen = false;
        },
        toggleModal: (state, action) => {
            state.cartModalOpen = !state.cartModalOpen
        },

        // THEME

        toggleTheme: (state, action) => {
            state.theme = state.theme == 'light' ? 'dark' : 'light';
        }
    }
})


export default uiSlice;
export const { openModal, closeModal, toggleTheme } = uiSlice.actions;