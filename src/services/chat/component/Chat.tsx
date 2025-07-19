import React from "react";
import { PDF } from "../../pdf/models";
import { Link } from "react-router-dom";

export type ChatProps = {
    pdfs: PDF[];
    name: string;
    picture: string;
    search: string;
    setSearch: (search: string) => void;
};

export const SearchInput: React.FunctionComponent<{
    search: string;
    setSearch: (search: string) => void;
}> = ({ search, setSearch }) => (
    <div className='relative mt-6'>
        <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
            <svg
                className='w-5 h-5 text-gray-400'
                viewBox='0 0 24 24'
                fill='none'
            >
                <path
                    d='M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                ></path>
            </svg>
        </span>

        <input
            type='text'
            className='w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring'
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
        />
    </div>
);
export const ChatSideBar: React.FunctionComponent<ChatProps> = ({
    pdfs,
    name,
    picture,
    search,
    setSearch,
}) => {
    const filteredPdfs = pdfs.filter((pdf) =>
        pdf.name.toLowerCase().includes(search.toLowerCase()),
    );
    return (
        <aside className='flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l'>
            <a href='#'>
                <img
                    className='w-auto h-6 sm:h-7'
                    src='https://merakiui.com/images/logo.svg'
                    alt=''
                />
            </a>
            <SearchInput search={search} setSearch={setSearch} />

            <div className='flex flex-col justify-between flex-1 mt-6'>
                <nav>
                    {filteredPdfs.map((pdf) => (
                        <Link
                            key={pdf.id}
                            to={`/chat/${pdf.id}`}
                            className='flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md hover:bg-gray-100 hover:text-gray-700'
                        >
                            {pdf.name.length > 20
                                ? `${pdf.name.slice(0, 20)}...`
                                : pdf.name}
                        </Link>
                    ))}
                </nav>

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
