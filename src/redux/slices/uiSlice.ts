import { createSlice, PayloadAction } from "@reduxjs/toolkit"
interface UIState {
    cartModalOpen: boolean;
    genericModalOpen: boolean;
    genericModalText: string;
    genericModalTitle: string;
    theme: 'light' | 'dark';
    headerSearchbarVisible: boolean
}


const initialState: UIState = {
    cartModalOpen: false,
    genericModalOpen: false,
    genericModalText: 'Amogus',
    genericModalTitle: 'Amonghuito',
    headerSearchbarVisible: false,
    theme: 'light',
}




const uiSlice = createSlice({
    name: "uiSlice",
    initialState,
    reducers: {
        openCartModal: (state) => {
            state.cartModalOpen = true;
        },
        closeCartModal: (state) => {
            state.cartModalOpen = false;
        },
        toggleCartModal: (state) => {
            state.cartModalOpen = !state.cartModalOpen
        },

        setSearchbarVisible: (state, action: { payload: boolean }) => {
            state.headerSearchbarVisible = action.payload
        },
        // THEME

        toggleTheme: (state,) => {
            state.theme = state.theme == 'light' ? 'dark' : 'light';
        }
    }
})


export default uiSlice;
export const { openCartModal, closeCartModal, toggleCartModal, toggleTheme, setSearchbarVisible } = uiSlice.actions;