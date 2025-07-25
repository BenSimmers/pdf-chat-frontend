import { createAsyncThunk } from "@reduxjs/toolkit";
import { PDF } from "../models";

type PDFUploadPayload = {
    file: File;
    token: string;
};

export const uploadPDF = createAsyncThunk<
    PDF,
    PDFUploadPayload,
    { rejectValue: string }
>("pdf/upload", async ({ file, token }, { rejectWithValue }) => {
    try {
        const apiURL = import.meta.env.VITE_API_URL;
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${apiURL}/upload`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Upload failed");
        }
        const data = await response.json();
        return {
            id: data.pdfId,
            name: file.name,
            content: data.content,
            url: data.url,
        };
    } catch (e) {
        if (e instanceof Error) {
            return rejectWithValue(e.message);
        }
        return rejectWithValue("An unknown error occurred");
    }
});

export const fetchPDFs = createAsyncThunk<
    PDF[],
    { token: string },
    { rejectValue: string }
>("pdf/fetchList", async ({ token }, { rejectWithValue }) => {
    try {
        const apiURL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiURL}/pdfs`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch PDFs");
        const data = await res.json();
        return data.pdfs;
    } catch {
        return rejectWithValue("Could not load PDFs");
    }
});

export const deletePDF = createAsyncThunk<
    { pdfId: string },
    { pdfId: string; token: string },
    { rejectValue: string }
>("pdf/delete", async ({ pdfId, token }, { rejectWithValue }) => {
    try {
        const apiURL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiURL}/pdfs/${pdfId}/delete`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to delete PDF");
        return { pdfId };
    } catch (e) {
        if (e instanceof Error) {
            return rejectWithValue(e.message);
        }
        return rejectWithValue("An unknown error occurred");
    }
});
