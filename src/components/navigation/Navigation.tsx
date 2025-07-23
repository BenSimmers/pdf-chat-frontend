import React from "react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, NavLink } from "react-router-dom";

export const Navigation: React.FunctionComponent = () => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const [menuOpen, setMenuOpen] = useState(false);

    const base =
        "block px-4 py-2 rounded text-white transition-colors duration-200";
    const linkBg = (isActive: boolean) =>
        isActive ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-700";
    const loginBg = "bg-blue-600 hover:bg-blue-700";
    const logoutBg = "bg-red-600 hover:bg-red-700";

    // factor out the actual items so we can render them twice
    const Items = () => (
        <>
            <NavLink
                to='/'
                end
                className={({ isActive }) => `${base} ${linkBg(isActive)}`}
            >
                Home
            </NavLink>

            {isAuthenticated && (
                <>
                    <NavLink
                        to='/upload'
                        className={({ isActive }) =>
                            `${base} ${linkBg(isActive)}`
                        }
                    >
                        Upload
                    </NavLink>

                    <NavLink
                        to='/chat'
                        className={({ isActive }) =>
                            `${base} ${linkBg(isActive)}`
                        }
                    >
                        Chat
                    </NavLink>
                </>
            )}

            {isAuthenticated ? (
                <button
                    onClick={() => logout()}
                    className={`${base} ${logoutBg}`}
                >
                    Log Out
                </button>
            ) : (
                <button
                    onClick={() =>
                        loginWithRedirect({
                            authorizationParams: {
                                // audience: process.env.VITE_AUTH0_AUDIENCE,
                                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                                scope: "openid profile email offline_access",
                                prompt: "consent" as const,
                            },
                        })
                    }
                    className={`${base} ${loginBg}`}
                >
                    Log In
                </button>
            )}
        </>
    );

    return (
        <nav className='bg-gray-800'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                    <Link to='/' className='text-white font-bold text-xl'>
                        Paper Pilot
                    </Link>

                    <button
                        className='sm:hidden p-2 rounded text-gray-300 hover:text-white hover:bg-gray-700'
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label='Toggle menu'
                    >
                        {menuOpen ? (
                            <svg className='h-6 w-6'>
                                <path
                                    d='M6 18L18 6M6 6l12 12'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        ) : (
                            <svg className='h-6 w-6'>
                                <path
                                    d='M4 6h16M4 12h16M4 18h16'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        )}
                    </button>

                    <div className='hidden sm:flex sm:items-center sm:space-x-2'>
                        <Items />
                    </div>
                </div>

                {menuOpen && (
                    <div className='sm:hidden bg-gray-800'>
                        <ul className='flex flex-col space-y-1 px-2 pb-4'>
                            <Items />
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};
