import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoIosMoon } from "react-icons/io";
import { IoMdSunny } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [showNav, setShowNav] = useState(window.innerWidth >= 600); // Initially based on screen size
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem('voting-app-theme') || "");
    const token = useSelector(state => state.vote?.currentVoter?.token);

    // Close the menu for small screens
    const closeMenu = () => {
        if (window.innerWidth < 600) {
            setShowNav(false);
        }
    };

    // Toggle dark/light theme
    const changeThemeHandler = () => {
        const currentTheme = localStorage.getItem('voting-app-theme');
        const newTheme = currentTheme === 'dark' ? '' : 'dark';
        localStorage.setItem('voting-app-theme', newTheme);
        setDarkTheme(newTheme);
    };

    // Apply theme to the body
    useEffect(() => {
        document.body.className = localStorage.getItem('voting-app-theme') || '';
    }, [darkTheme]);

    // Update menu visibility on window resize
    useEffect(() => {
        const handleResize = () => {
            setShowNav(window.innerWidth >= 600);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <nav>
            <div className="container nav__container">
                <Link to="/elections" className="nav__logo">ElectoPoint</Link>
                <div>
                    {/* Display menu only if token exists and showNav is true */}
                    {token && showNav && (
                        <menu className="nav__menu">
                            <NavLink to="/elections" onClick={closeMenu}>Elections</NavLink>
                            <NavLink to="/results" onClick={closeMenu}>Results</NavLink>
                            <NavLink to="/logout" onClick={closeMenu}>Logout</NavLink>
                        </menu>
                    )}

                    {/* Theme toggle button */}
                    <button
                        className="theme__toggle-btn"
                        onClick={changeThemeHandler}
                    >
                        {darkTheme === 'dark' ? <IoMdSunny /> : <IoIosMoon />}
                    </button>

                    {/* Navigation toggle button */}
                    <button
                        className="nav__toggle-btn"
                        onClick={() => setShowNav(!showNav)}
                    >
                        {showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
