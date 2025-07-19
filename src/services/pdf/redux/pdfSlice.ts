import { createSlice } from "@reduxjs/toolkit";
import { PDF } from "../models/types";
import { Status } from "../../../lib/constants/status";
import { RootState } from "../../../lib/store";
import { fetchPDFs, uploadPDF } from "./thunks";

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
            });
    },
});

export const selectFiveMostRecentPdfs = (state: RootState) =>
    state.pdf.pdfs.slice(-5).reverse();

export const { setPdfs } = pdfSlice.actions;
export default pdfSlice.reducer;
