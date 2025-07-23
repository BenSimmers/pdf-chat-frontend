import React from 'react';

/**
 * SearchInput component for filtering PDFs in the chat sidebar.
 */
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
