import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = () => {
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Menu' },
        { path: '/cart', label: 'Cart' },
        { path: '/order', label: 'Order' },
    ];

    return (
        <nav className="w-full h-16 border shadow-lg flex items-center justify-center px-6">
            <ul className="flex gap-x-20 justify-center">
                {navLinks.map((link) => (
                    <li key={link.path}>
                        <Link
                            to={link.path}
                            className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                                location.pathname === link.path
                                    ? 'bg-green-500 text-white'
                                    : 'text-black hover:bg-green-300 hover:text-white'
                            }`}
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
