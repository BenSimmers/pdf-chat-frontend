import React, { useState, useRef } from "react";
import { PDF } from "../../pdf/models";
import { useNavigate } from "react-router-dom";
import { useDetectClickOutside } from "../../../lib/hooks/useDetectClickOutside";
import { SearchInput } from "./SearchInput";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

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
    const [collapsed, setCollapsed] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate();

    useDetectClickOutside(
        dropdownRef as React.RefObject<HTMLDivElement>,
        () => {
            setOpenMenuId(null);
        },
    );

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const filteredPdfs = pdfs.filter((pdf) =>
        pdf.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <aside
            className={`flex flex-col h-screen py-8 bg-white overflow-y-auto transition-all duration-300 ${collapsed ? "w-20 px-2" : "w-64 px-4"
                }`}
        >
            <SidebarHeader collapsed={collapsed} toggleCollapse={toggleCollapse} />
            <div
                className={`transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"
                    }`}
            >
                <SearchInput search={search} setSearch={setSearch} />
            </div>
            <div className='flex flex-col justify-between flex-1 mt-6'>
                <SidebarNav
                    pdfs={filteredPdfs}
                    collapsed={collapsed}
                    hoveredId={hoveredId}
                    openMenuId={openMenuId}
                    dropdownRef={dropdownRef as React.RefObject<HTMLDivElement>}
                    setHoveredId={setHoveredId}
                    setOpenMenuId={setOpenMenuId}
                    actions={actions}
                />

                {filteredPdfs.length === 0 && (
                    <div
                        className={`text-gray-500 text-center mt-4 transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"
                            }`}
                        onClick={() => navigate("/upload")}
                    >
                        No PDFs found
                    </div>
                )}

                <SidebarFooter
                    name={name}
                    picture={picture}
                    collapsed={collapsed}
                />
            </div>
        </aside>
    );
};
