import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Status } from "../../../lib/constants/status";

export type ChatMessage = { role: string; content: string; created_at?: string };

type SendMessagePayload = {
    documentId: number;
    question: string;
    token: string;
};

type FetchHistoryPayload = {
    documentId: number;
    token: string;
};

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

export const fetchChatHistory = createAsyncThunk<
    { documentId: number; messages: ChatMessage[] },
    FetchHistoryPayload,
    { rejectValue: string }
>("chat/fetchHistory", async ({ documentId, token }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/pdfs/${documentId}/chat-history`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch chat history");
        const data = await res.json();
        return { documentId, messages: data.messages };
    } catch {
        return rejectWithValue("Could not load chat history");
    }
});

export const sendChatMessage = createAsyncThunk<
    { documentId: number; assistantMessage: ChatMessage },
    SendMessagePayload,
    { rejectValue: string }
>("chat/sendMessage", async ({ documentId, question, token }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/pdfs/${documentId}/chat`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        });
        const data = await res.json();
        const assistantMessage: ChatMessage = { role: "assistant", content: data.answer };
        return { documentId, assistantMessage };
    } catch {
        return rejectWithValue("Failed to send message");
    }
});

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addUserMessage: (state, action: { payload: { documentId: number; message: ChatMessage } }) => {
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
                state.messagesByDocId[action.payload.documentId] = action.payload.messages;
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
                state.messagesByDocId[documentId] = [...thread, assistantMessage];
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
