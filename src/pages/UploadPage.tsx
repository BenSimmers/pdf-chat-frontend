import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePDF } from "../services/pdf/hooks/usePDF";
import { useChat } from "../services/chat/hooks/useChat";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Breadcrumbs } from "../components/breadcrumbs/Breadcrumbs";

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const { uploadPDF, loading, error } = usePDF();
    const lastUploadedId = useSelector((state: RootState) => state.pdf.lastUploadedId);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pdfIdFromUrl = queryParams.get("pdfId");
    const documentId = pdfIdFromUrl ? Number(pdfIdFromUrl) : lastUploadedId;

    const { messages, sendMessage, loadHistory } = useChat(documentId ?? 0);

    const handleFileChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }, []);

    const handleSubmit = React.useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;
        uploadPDF(file);
    }, [file, uploadPDF]);

    useEffect(() => {
        if (documentId) loadHistory();
    }, [documentId, loadHistory]);

    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <>
            <Breadcrumbs />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {!pdfIdFromUrl && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload PDF</h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-gray-700">Select a PDF file</span>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="mt-2 block w-full text-sm text-gray-700
                       file:mr-4 file:py-2 file:px-4
                       file:rounded file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </label>

                            {file && (
                                <p className="text-sm text-gray-600">
                                    Selected: <span className="font-medium">{file.name}</span>
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex justify-center items-center
                     bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                            >
                                {loading ? "Uploading..." : "Upload"}
                            </button>

                            {error && (
                                <p className="text-sm text-red-500 mt-2">
                                    {error}
                                </p>
                            )}
                        </form>
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Ask Questions</h2>
                    {documentId && (
                        <div className="space-y-4">
                            <div className="border rounded p-4 overflow-y-auto bg-gray-50 h-96 scroll-smooth no-scrollbar">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        <div ref={scrollRef} />
                                        <div className={`inline-block px-3 py-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'} max-w-2/3`}>
                                            {msg.content}
                                        </div>
                                        <div ref={scrollRef} />
                                    </div>
                                ))}
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!newMessage.trim()) return;
                                    sendMessage(newMessage);
                                    setNewMessage('');
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 border rounded px-3 py-2"
                                    placeholder="Ask a question..."
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                                    disabled={!newMessage.trim()}
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default UploadPage;
