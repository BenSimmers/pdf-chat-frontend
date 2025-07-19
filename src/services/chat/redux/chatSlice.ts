import { createSlice } from "@reduxjs/toolkit";
import { Status } from "../../../lib/constants/status";
import { ChatMessage } from "../models";
import { fetchChatHistory, sendChatMessage } from "./thunks";

interface ChatState {
    messagesByDocId: Record<number, ChatMessage[]>;
    status: Status;
    error: string | null;
}

const initialState: ChatState = {
    messagesByDocId: {},
    status: Status.IDLE,
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addUserMessage: (
            state,
            action: { payload: { documentId: number; message: ChatMessage } },
        ) => {
            const { documentId, message } = action.payload;
            const thread = state.messagesByDocId[documentId] ?? [];
            state.messagesByDocId[documentId] = [...thread, message];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatHistory.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.messagesByDocId[action.payload.documentId] =
                    action.payload.messages;
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.status = Status.ERROR;
                state.error = action.payload ?? "Error fetching chat history";
            });

        builder
            .addCase(sendChatMessage.pending, (state) => {
                state.status = Status.LOADING;
            })
            .addCase(sendChatMessage.fulfilled, (state, action) => {
                const { documentId, assistantMessage } = action.payload;
                const thread = state.messagesByDocId[documentId] ?? [];
                state.messagesByDocId[documentId] = [
                    ...thread,
                    assistantMessage,
                ];
                state.status = Status.SUCCESS;
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.status = Status.ERROR;
                state.error = action.payload ?? "Error sending chat message";
            });
    },
});

export const { addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
