import { createSlice, PayloadAction } from "@reduxjs/toolkit"


type ModalActionType = 'DELETE_PRODUCT' | 'ARCHIVE_PRODUCT' | 'PUBLISH_PRODUCT' | 'CONFIRM_PRODUCT' | null

interface UIState {
    cartModalOpen: boolean;
    genericModalOpen: boolean;
    genericModalText: string;
    genericModalTitle: string;
    theme: 'light' | 'dark';
}

type AskModalPayload = {
    text: string,
    title: string,
}

const initialState: UIState = {
    cartModalOpen: false,
    genericModalOpen: false,
    genericModalText: 'Amogus',
    genericModalTitle: 'Amonghuito',
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

        askGenericModal: (state, action: PayloadAction<AskModalPayload>) => {
            console.log('got action')
            state.genericModalOpen = true;
            state.genericModalText = action.payload.text
            state.genericModalTitle = action.payload.title
        },

        cancelGenericModal: (state) => {
            state.genericModalOpen = false;
            state.genericModalText = ''
            state.genericModalTitle = ''
        },

        // THEME

        toggleTheme: (state,) => {
            state.theme = state.theme == 'light' ? 'dark' : 'light';
        }
    }
})


export default uiSlice;
export const { openCartModal, closeCartModal, toggleCartModal, toggleTheme, askGenericModal, cancelGenericModal } = uiSlice.actions;