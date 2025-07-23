import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PDF } from "../../pdf/models";
import { DotsVerticalIcon } from "../../../components/icons/VerticalDots";

export type Actions = {
    delete?: (pdfId: string) => void;
}

type SidebarNavProps = {
    pdfs: PDF[];
    collapsed: boolean;
    hoveredId: string | null;
    openMenuId: string | null;
    dropdownRef: React.RefObject<HTMLDivElement>;
    setHoveredId: (id: string | null) => void;
    setOpenMenuId: (id: string | null) => void;
    actions: Actions;
    navigate: ReturnType<typeof useNavigate>;
};

export const SidebarNav: React.FunctionComponent<SidebarNavProps> = ({
    pdfs,
    collapsed,
    hoveredId,
    openMenuId,
    dropdownRef,
    setHoveredId,
    setOpenMenuId,
    actions,
    navigate,
}) => {
    // const navigate = useNavigate();
    return (
        <nav>
            {pdfs.map((pdf) => (
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
                        <span
                            className={`transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"
                                }`}
                        >
                            {pdf.name.length > 20
                                ? `${pdf.name.slice(0, 20)}…`
                                : pdf.name}
                        </span>
                    </Link>

                    {(!collapsed &&
                        (hoveredId === pdf.id || openMenuId === pdf.id)) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(
                                        openMenuId === pdf.id ? null : pdf.id,
                                    );
                                }}
                                className='p-1 rounded hover:bg-gray-200'
                            >
                                <DotsVerticalIcon className='w-5 h-5 text-gray-500' />
                            </button>
                        )}

                    {openMenuId === pdf.id && !collapsed && (
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
    );
};
