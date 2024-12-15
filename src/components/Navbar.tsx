import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = () => {
    const location = useLocation();

    const navLinks = [
        { path: "/", label: "Menu" },
        { path: "/cart", label: "Cart" },
        { path: "/order", label: "Order" },
    ];

    return (
        <nav className="w-full h-20 shadow-md flex items-center justify-between px-6 bg-white border-b md:px-10">
            {/* Logo Section */}
            <div className="flex items-center justify-start space-x-4">
                <img
                    src="/logo1.png"
                    alt="Logo"
                    className="h-12 w-12 md:h-12 md:w-12 object-contain"
                />
                <span className="text-lg font-bold text-gray-800 md:text-2xl">
                    Fasbite
                </span>
            </div>

            {/* Navigation Links */}
            <ul className="flex gap-x-8 justify-center flex-1">
                {navLinks.map((link) => (
                    <li key={link.path}>
                        <Link
                            to={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 md:text-base 
                                ${location.pathname === link.path
                                    ? "bg-green-500 text-white shadow-md"
                                    : "text-gray-600 hover:bg-green-100 hover:text-green-500"}`}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
