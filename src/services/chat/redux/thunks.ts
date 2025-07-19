import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatMessage } from "../models";

type SendMessagePayload = {
    documentId: number;
    question: string;
    token: string;
};

type FetchHistoryPayload = {
    documentId: number;
    token: string;
};

const fetchChatHistory = createAsyncThunk<
    { documentId: number; messages: ChatMessage[] },
    FetchHistoryPayload,
    { rejectValue: string }
>("chat/fetchHistory", async ({ documentId, token }, { rejectWithValue }) => {
    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/pdfs/${documentId}/chat-history`,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        if (!res.ok) throw new Error("Failed to fetch chat history");
        const data = await res.json();
        return { documentId, messages: data.messages };
    } catch {
        return rejectWithValue("Could not load chat history");
    }
});

const sendChatMessage = createAsyncThunk<
    { documentId: number; assistantMessage: ChatMessage },
    SendMessagePayload,
    { rejectValue: string }
>(
    "chat/sendMessage",
    async ({ documentId, question, token }, { rejectWithValue }) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/pdfs/${documentId}/chat`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ question }),
                },
            );
            const data = await res.json();
            const assistantMessage: ChatMessage = {
                role: "assistant",
                content: data.answer,
            };
            return { documentId, assistantMessage };
        } catch {
            return rejectWithValue("Failed to send message");
        }
    },
);

export { fetchChatHistory, sendChatMessage };
