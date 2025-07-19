import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../lib/store";
import { useDispatch } from "react-redux";
import { fetchPDFs } from "../redux/pdfSlice";
import { Status } from "../../../lib/constants";

export const usePdfs = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { token } = useSelector((state: RootState) => state.auth);
    const { pdfs, status } = useSelector((state: RootState) => state.pdf);

    useEffect(() => {
        if (token && status === Status.IDLE) {
            dispatch(fetchPDFs({ token }));
        }
    }, [token, status, dispatch]);

    return { loading: status === Status.LOADING, pdfs };
};
