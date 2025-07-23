import React from "react";
import { usePdfs } from "../services/pdf/hooks/usePdfs";
import { useNavigate } from "react-router-dom";
import { usePDF } from "../services/pdf/hooks/usePDF";


type CardProps = {
    pdf: {
        id: string;
        name: string;
    };
    onDelete: (pdfId: string) => void;
    onSelect: (pdfId: string) => void;
};

const Card: React.FunctionComponent<CardProps> = ({ pdf, onDelete, onSelect }) => (
    <div className='bg-white shadow hover:shadow-lg transition-shadow cursor-pointer p-4 w-3xs h-3xs rounded-lg hover:bg-gray-50 flex flex-col justify-between'>
        <div>
            <h2 className='text-lg font-semibold'>{pdf.name}</h2>
        </div>
        <div className='flex justify-between mt-2'>
            <button
                className='text-blue-500 hover:underline'
                onClick={() => onSelect(pdf.id)}
            >
                View Details
            </button>
            <button
                className='text-red-500 hover:underline'
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the onClick for the div
                    onDelete(pdf.id);
                }}
            >
                Delete PDF
            </button>
        </div>
    </div>
);

export const HomePage = () => {
    const { pdfs, loading } = usePdfs();
    const { deletePDF } = usePDF();
    const navigate = useNavigate();

    const selectPdf = React.useCallback(
        (id: string) => {
            navigate(`/upload?pdfId=${id}`);
        },
        [navigate],
    );

    const pdfsList =
        pdfs.length === 0 && !loading ? (
            <div className='text-gray-500'>No PDFs uploaded yet</div>
        ) : (
            pdfs.map((pdf) => (
                <Card
                    key={pdf.id}
                    pdf={pdf}
                    onDelete={deletePDF}
                    onSelect={selectPdf}
                />
            ))
        );

    return (
        <div className='flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100'>
            <h1 className='text-4xl font-bold mb-4'>PaperPilot</h1>
            <p className='mb-6'>
                Get real-time answers to your questions about your PDFs
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8'>
                {pdfsList}
            </div>
        </div>
    );
};
