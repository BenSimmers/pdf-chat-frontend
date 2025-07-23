import React from "react";

type SidebarFooterProps = {
    name: string;
    picture: string;
    collapsed: boolean;
};

export const SidebarFooter: React.FunctionComponent<SidebarFooterProps> = ({
    name,
    picture,
    collapsed,
}) => {
    return (
        <a
            className={`flex items-center px-4 -mx-2 ${
                collapsed ? "justify-center" : ""
            }`}
        >
            <img
                className='object-cover mx-2 rounded-full h-9 w-9'
                src={picture}
                alt='avatar'
            />
            <span
                className={`mx-2 font-medium text-gray-800 transition-opacity duration-300 ${
                    collapsed ? "opacity-0" : "opacity-100"
                }`}
            >
                {name}
            </span>
        </a>
    );
};
