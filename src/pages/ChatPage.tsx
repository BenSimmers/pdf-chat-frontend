import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../services/chat/hooks/useChat";
import { Breadcrumbs } from "../components/breadcrumbs/Breadcrumbs";
import { ChatSideBar } from "../services/chat/components/Sidebar";
import { usePdfs } from "../services/pdf/hooks/usePdfs";
import { useAuth0 } from "@auth0/auth0-react";
import { usePDF } from "../services/pdf/hooks/usePDF";
import TypingIndicator from "../components/icons/TypingIndicator";

type Params = {
    documentId?: string;
};

const ChatPage = () => {
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { documentId } = useParams<Params>();
    const docId = Number(documentId);
    const { pdfs, loading: pdfsLoading } = usePdfs();
    const { user } = useAuth0();
    const { deletePDF } = usePDF();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const { picture, given_name } = user || { picture: "", given_name: "" };
    const { messages, sendMessage, loadHistory, status } = useChat(docId ?? 0);

    useEffect(() => {
        if (docId) loadHistory();
    }, [docId, loadHistory]);

    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className='flex h-screen'>
            <ChatSideBar
                pdfs={pdfs}
                name={given_name ?? ""}
                picture={picture ?? ""}
                search={searchQuery}
                setSearch={setSearchQuery}
                actions={{
                    delete: (pdfId: string) => {
                        deletePDF(pdfId);
                    },
                }}
            />
            <div className='flex-1 flex flex-col'>
                <Breadcrumbs />
                <div className='flex-1 p-6 overflow-y-auto'>
                    {pdfsLoading && <p>Loading PDFs...</p>}
                    {docId ? (
                        <div className='space-y-4'>
                            <div className='border rounded p-4 overflow-y-auto bg-gray-50 h-96 scroll-smooth no-scrollbar'>
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
                                    >
                                        <div ref={scrollRef} />
                                        <div
                                            className={`inline-block px-3 py-2 rounded ${msg.role === "user" ? "bg-blue-200" : "bg-gray-200"} max-w-2/3`}
                                        >
                                            {msg.content}
                                        </div>
                                        <div ref={scrollRef} />
                                    </div>
                                ))}
                                {status === "loading" && (
                                    <div className='text-left'>
                                        <TypingIndicator />
                                    </div>
                                )}
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!newMessage.trim()) return;
                                    sendMessage(newMessage);
                                    setNewMessage("");
                                }}
                                className='flex gap-2'
                            >
                                <input
                                    type='text'
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    className='flex-1 border rounded px-3 py-2'
                                    placeholder='Ask a question...'
                                />
                                <button
                                    type='submit'
                                    className='bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50'
                                    disabled={!newMessage.trim()}
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center h-full'>
                            {pdfs.length === 0 ? (
                                <div className='text-center flex flex-col items-center'>
                                    <p className='text-gray-500'>
                                        Doesn&apos;t look like you&apos;ve got
                                        any PDFs uploaded.
                                    </p>
                                    <button
                                        onClick={() =>
                                            (window.location.href = "/upload")
                                        }
                                        className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
                                    >
                                        Upload a PDF
                                    </button>
                                </div>
                            ) : (
                                <p className='text-gray-500'>
                                    Select a PDF from the sidebar to start
                                    chatting.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
