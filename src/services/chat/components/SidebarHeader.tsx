import React from "react";

type SidebarHeaderProps = {
    collapsed: boolean;
    toggleCollapse: () => void;
};

export const SidebarHeader: React.FunctionComponent<SidebarHeaderProps> = ({
    collapsed,
    toggleCollapse,
}) => {
    return (
        <div className='flex items-center justify-between'>
            <div
                className={`flex items-center space-x-2 transition-opacity duration-300 ${
                    collapsed ? "opacity-0" : "opacity-100"
                }`}
            >
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
                {!collapsed && <p>Your Chats</p>}
            </div>
            <button
                onClick={toggleCollapse}
                className='p-2 rounded-md hover:bg-gray-100'
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`size-6 transition-transform duration-300 ${
                        collapsed ? "rotate-180" : ""
                    }`}
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 19.5 8.25 12l7.5-7.5'
                    />
                </svg>
            </button>
        </div>
    );
};
