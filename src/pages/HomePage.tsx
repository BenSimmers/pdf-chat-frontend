import React from "react";
import { usePdfs } from "../services/pdf/hooks/usePdfs";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
    const { pdfs, loading } = usePdfs();
    const navigate = useNavigate();

    const selectPdf = React.useCallback(
        (id: number) => {
            navigate(`/upload?pdfId=${id}`);
        },
        [navigate],
    );

    const loadingMessage = loading ? (
        <div className='text-gray-500'>Loading PDFs...</div>
    ) : null;

    const pdfsList =
        pdfs.length === 0 && !loading ? (
            <div className='text-gray-500'>No PDFs uploaded yet</div>
        ) : (
            pdfs.map((pdf) => (
                <div
                    key={pdf.id}
                    className='bg-white outline shadow hover:shadow-lg transition-shadow cursor-pointer'
                    onClick={() => selectPdf(Number(pdf.id))}
                >
                    <h2 className='text-lg font-semibold'>{pdf.name}</h2>
                    <button
                        className='mt-2 text-blue-500 hover:underline'
                        onClick={() => selectPdf(Number(pdf.id))}
                    >
                        View Details
                    </button>
                </div>
            ))
        );

    return (
        <div className='flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100'>
            <h1 className='text-4xl font-bold mb-4'>PaperPilot</h1>
            <p className='mb-6'>
                Get real-time answers to your questions about your PDFs
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8'>
                {loadingMessage}
                {pdfsList}
            </div>
        </div>
    );
};
