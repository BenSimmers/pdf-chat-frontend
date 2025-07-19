import { Link, useLocation } from "react-router-dom";

export const Breadcrumbs = () => {
    const { pathname } = useLocation();
    const parts = pathname.split('/').filter(part => part);

    return (
        <div className="bg-gray-100 p-4">
            <nav className="flex items-center space-x-2">
                <Link to="/" className="text-blue-500 hover:underline">Home</Link>
                {parts.length > 0 && <span className="text-gray-500">/</span>}
                {parts.map((part, index) => {
                    const path = `/${parts.slice(0, index + 1).join('/')}`;
                    return (
                        <span key={path} className="text-gray-500">
                            <Link to={path} className="hover:underline capitalize">{part}</Link>
                            {index < parts.length - 1 && <span className="mx-2">/</span>}
                        </span>
                    );
                })}
            </nav>
        </div>

    );
}