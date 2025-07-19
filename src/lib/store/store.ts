import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import pdfSlice from "../../services/pdf/redux/pdfSlice";
import chatSlice from "../../services/chat/redux/chatSlice";
import authSlice from "../../lib/auth/redux/authSlice";
const reducers = {
    pdf: pdfSlice,
    chat: chatSlice,
    auth: authSlice,
};

export const store = configureStore({
    reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
