/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */

import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../app/features/themeSlice';
import { logout, setError } from "../app/features/authSlice";
import axios from "axios"

const Navbar = () => {

    //for mobile view
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [selectedCity, setSelectedCity] = useState("Mumbai");
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const dispatch = useDispatch();
    const getAvatar = useSelector((state) => state.auth.avatar);
    const isDarkMode = useSelector((state) => state.theme.darkMode);
    const city = useSelector(state => state.auth.city);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    useEffect(() => {
        const cityName =  capitalizeFirstLetter(city);
        setSelectedCity(cityName);
    }, [selectedCity])

    const handleLogout = async () => {
        const axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
            withCredentials: true,
        })
        setIsLoading(true);

        try {
            await axiosInstance.get("/api/v1/users/logout");
            dispatch(logout());
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } catch (error) {
            console.log(error)
        } finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // An api call will be made and colleges in that city will be rendered
    }, [selectedCity])

    return (
        <nav className={`w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section */}
                    <div className="flex items-center">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        {/* Logo/Home */}
                        <a href="/" className="font-bold text-xl ml-2">Home</a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* City Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                                // onMouseEnter={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                                // onMouseLeave={() => setIsCityDropdownOpen(!isCityDropdownOpen)}

                                className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-white"
                            >
                                {selectedCity}
                            </button>
                            {isCityDropdownOpen && (
                                <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700">
                                    <div className="py-1">
                                        {/* {cities.map((city) => (
                                            <button
                                                key={city}
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                    setIsCityDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                {city}
                                            </button>
                                        ))} */}

                                        {/* Later on we will get the values using a api call */}
                                        <button onClick={() => {
                                            setSelectedCity("Delhi");
                                            setIsCityDropdownOpen(false);
                                        }}
                                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >Delhi</button>
                                        <button onClick={() => {
                                            setSelectedCity("Indore");
                                            setIsCityDropdownOpen(false);
                                        }}
                                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >Indore</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <a href="/contact" className="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-white dark:hover:bg-gray-700">
                            Contact us
                        </a>
                        <a href="/review" className="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-white dark:hover:bg-gray-700">
                            Review our app
                        </a>
                        {/* Theme Toggle */}
                        <button
                            onClick={
                                () => {
                                    //humara state update ho raha hai, bs changes visible nhi hai
                                    dispatch(toggleTheme());
                                }
                            }
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-white"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="p-2 rounded-md" // hover:bg-gray-100 dark:hover:bg-gray-700
                            >
                                {/* <User className="h-5 w-5" /> */}
                                <img src={getAvatar} className='h-12 w-12 rounded-full' />
                            </button>
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700">
                                    <div className="py-1">
                                        <a href="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                            View Profile
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;