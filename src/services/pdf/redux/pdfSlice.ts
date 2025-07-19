import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PDF } from "../models/types";
import { Status } from "../../../lib/constants/status";
import { RootState } from "../../../lib/store";

type PDFUploadPayload = {
    file: File;
    token: string;
};

export const uploadPDF = createAsyncThunk<PDF, PDFUploadPayload, { rejectValue: string }>(
    "pdf/upload",
    async ({ file, token }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("http://localhost:3001/api/upload", {
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
                url: data.url
            };


        } catch (e) {
            if (e instanceof Error) {
                return rejectWithValue(e.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    },
);

export const fetchPDFs = createAsyncThunk<PDF[], { token: string }, { rejectValue: string }>(
    'pdf/fetchList',
    async ({ token }, { rejectWithValue }) => {
        try {

            const res = await fetch('http://localhost:3001/api/pdfs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch PDFs');
            const data = await res.json();
            return data.pdfs;
        } catch {
            return rejectWithValue('Could not load PDFs');
        }
    }
);

interface PDFState {
    pdfs: PDF[];
    status: Status;
    error: string | null;
    lastUploadedId: number | null;
}

const initialState: PDFState = {
    pdfs: [],
    status: Status.IDLE,
    error: null,
    lastUploadedId: null,
};

const pdfSlice = createSlice({
    name: "pdf",
    initialState,
    reducers: {
        setPdfs: (state, action) => {
            state.pdfs = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadPDF.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(uploadPDF.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.pdfs.push(action.payload);
                state.lastUploadedId = Number(action.payload.id);
            })
            .addCase(uploadPDF.rejected, (state, action) => {
                state.status = Status.ERROR;
                state.error = action.payload ?? "Failed to upload PDF";
            })
            .addCase(fetchPDFs.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(fetchPDFs.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.pdfs = action.payload;
            })
            .addCase(fetchPDFs.rejected, (state, action) => {
                state.status = Status.ERROR;
                state.error = action.payload ?? "Failed to fetch PDFs";
            })
    },
});

export const selectFiveMostRecentPdfs = (state: RootState) => state.pdf.pdfs.slice(-5).reverse();

export const { setPdfs } = pdfSlice.actions;
export default pdfSlice.reducer;
