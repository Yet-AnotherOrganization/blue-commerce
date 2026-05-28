import { createSlice, PayloadAction } from "@reduxjs/toolkit"
interface UIState {
    cartModalOpen: boolean;
    genericModalOpen: boolean;
    genericModalText: string;
    genericModalTitle: string;
    theme: 'light' | 'dark';
    headerSearchbarVisible: boolean;
    onboardingStep: number;
    onboardingData: Record<string, any>,
    adminSidebarOpen: boolean
}


const initialState: UIState = {
    cartModalOpen: false,
    genericModalOpen: false,
    genericModalText: 'Amogus',
    genericModalTitle: 'Amonghuito',
    headerSearchbarVisible: false,
    theme: 'light',
    onboardingStep: 1,
    onboardingData: {},
    adminSidebarOpen: true,
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
        },

        // ONBOARDING

        onboardingNextStep: (state) => {
            state.onboardingStep++
        },
        onboardingPrevStep: (state) => {
            state.onboardingStep--
        },
        onboardingSetStep: (state, action: PayloadAction<number>) => {
            state.onboardingStep = action.payload
        },
        onboardingSetData: (state, action: PayloadAction<Record<string, string>>) => {
            state.onboardingData = action.payload;
        },
        onboardingAddData: (state, action: PayloadAction<Record<string, any>>) => {
            state.onboardingData = { ...state.onboardingData, ...action.payload };
        },

        openAdminSidebar: (state) => { state.adminSidebarOpen = true },
        closeAdminSidebar: (state) => { state.adminSidebarOpen = false },
        toggleAdminSidebar: (state) => { state.adminSidebarOpen = !state.adminSidebarOpen },

    }
})


export default uiSlice;
export const {
    openCartModal,
    closeCartModal,
    toggleCartModal,
    toggleTheme,
    setSearchbarVisible,
    onboardingSetStep,
    onboardingNextStep,
    onboardingPrevStep,
    onboardingAddData,
    onboardingSetData,
    openAdminSidebar,
    closeAdminSidebar,
    toggleAdminSidebar
} = uiSlice.actions;