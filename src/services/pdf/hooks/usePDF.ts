import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../lib/store";
import {
    fetchPDFs,
    uploadPDF as uploadPDFAction,
    deletePDF as deletePDFAction,
} from "../redux/thunks";

export const usePDF = () => {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector((state: RootState) => state.auth.token);
    const { pdfs, status, error } = useSelector(
        (state: RootState) => state.pdf,
    );

    const uploadPDF = React.useCallback(
        async (file: File) => {
            try {
                if (!token) return;

                await dispatch(uploadPDFAction({ file, token }));
            } catch (err) {
                console.error("Failed to upload PDF:", err);
            }
        },
        [dispatch, token],
    );

    const deletePDF = React.useCallback(
        async (pdfId: string) => {
            try {
                if (!token) return;
                await dispatch(deletePDFAction({ pdfId, token }));
            } catch (err) {
                console.error("Failed to delete PDF:", err);
            }
        },
        [dispatch, token],
    );

    React.useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            dispatch(fetchPDFs({ token }));
        };
        fetchData();
    }, [dispatch, token]);

    return {
        pdfs,
        loading: status === "loading",
        error,
        uploadPDF,
        deletePDF,
    };
};
