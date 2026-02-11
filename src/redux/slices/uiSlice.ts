import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartModalOpen: false,
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
        }
    }
})