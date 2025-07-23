import React, { useState, useRef } from "react";
import { PDF } from "../../pdf/models";
import { Link, useNavigate } from "react-router-dom";
import { useDetectClickOutside } from "../../../lib/hooks/useDetectClickOutside";
import { DotsVerticalIcon } from "../../../components/icons/VerticalDots";
import { SearchInput } from "./SearchInput";

export type ChatProps = {
    pdfs: PDF[];
    name: string;
    picture: string;
    search: string;
    setSearch: (search: string) => void;
    actions?: {
        delete?: (pdfId: string) => void;
    };
};

export const ChatSideBar: React.FC<ChatProps> = ({
    pdfs,
    name,
    picture,
    search,
    setSearch,
    actions = {},
}) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useDetectClickOutside(
        dropdownRef as React.RefObject<HTMLDivElement>,
        () => {
            setOpenMenuId(null);
        },
    );

    const filteredPdfs = pdfs.filter((pdf) =>
        pdf.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <aside className='flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white'>
            <div className='flex items-center space-x-2'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                    />
                </svg>
                <p>Your Chats</p>
            </div>
            <SearchInput search={search} setSearch={setSearch} />
            <div className='flex flex-col justify-between flex-1 mt-6'>
                <nav>
                    {filteredPdfs.map((pdf) => (
                        <div
                            key={pdf.id}
                            onMouseEnter={() => setHoveredId(pdf.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className='relative flex items-center px-4 py-2 mt-5 rounded-md hover:bg-gray-100'
                        >
                            <Link
                                to={`/chat/${pdf.id}`}
                                className='flex-1 text-gray-600 hover:text-gray-700'
                            >
                                {pdf.name.length > 20
                                    ? `${pdf.name.slice(0, 20)}…`
                                    : pdf.name}
                            </Link>

                            {(hoveredId === pdf.id ||
                                openMenuId === pdf.id) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(
                                            openMenuId === pdf.id
                                                ? null
                                                : pdf.id,
                                        );
                                    }}
                                    className='p-1 rounded hover:bg-gray-200'
                                >
                                    <DotsVerticalIcon className='w-5 h-5 text-gray-500' />
                                </button>
                            )}

                            {openMenuId === pdf.id && (
                                <div
                                    ref={dropdownRef}
                                    className='absolute right-4 top-full mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20'
                                >
                                    <button
                                        className='w-full text-left px-4 py-2 hover:bg-gray-100'
                                        onClick={() => {
                                            if (actions.delete) {
                                                actions.delete(pdf.id);
                                            }
                                            setOpenMenuId(null);
                                            navigate("/chat");
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {filteredPdfs.length === 0 && (
                    <div
                        className='text-gray-500 text-center mt-4'
                        onClick={() => navigate("/upload")}
                    >
                        No PDFs found
                    </div>
                )}

                <a className='flex items-center px-4 -mx-2'>
                    <img
                        className='object-cover mx-2 rounded-full h-9 w-9'
                        src={picture}
                        alt='avatar'
                    />
                    <span className='mx-2 font-medium text-gray-800'>
                        {name}
                    </span>
                </a>
            </div>
        </aside>
    );
};
