import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePDF } from "../services/pdf/hooks/usePDF";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Breadcrumbs } from "../components/breadcrumbs/Breadcrumbs";

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const { uploadPDF, loading, error } = usePDF();
    const lastUploadedId = useSelector(
        (state: RootState) => state.pdf.lastUploadedId,
    );
    const navigate = useNavigate();

    const handleFileChange = React.useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                setFile(e.target.files[0]);
            }
        },
        [],
    );

    const handleSubmit = React.useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!file) return;
            uploadPDF(file);
        },
        [file, uploadPDF],
    );

    useEffect(() => {
        if (lastUploadedId) {
            navigate(`/chat/${lastUploadedId}`);
        }
    }, [lastUploadedId, navigate]);

    return (
        <>
            <Breadcrumbs />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-6'>
                        Upload PDF
                    </h1>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <label className='block'>
                            <span className='text-gray-700'>
                                Select a PDF file
                            </span>
                            <input
                                type='file'
                                accept='application/pdf'
                                onChange={handleFileChange}
                                className='mt-2 block w-full text-sm text-gray-700
                       file:mr-4 file:py-2 file:px-4
                       file:rounded file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       focus:outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </label>

                        {file && (
                            <p className='text-sm text-gray-600'>
                                Selected:{" "}
                                <span className='font-medium'>{file.name}</span>
                            </p>
                        )}

                        <button
                            type='submit'
                            disabled={loading}
                            className='flex justify-center items-center
                     bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-medium py-2 px-4 rounded transition-colors duration-200'
                        >
                            {loading ? "Uploading..." : "Upload"}
                        </button>

                        {error && (
                            <p className='text-sm text-red-500 mt-2'>{error}</p>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default UploadPage;
