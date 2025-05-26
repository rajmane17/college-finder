/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../app/features/themeSlice';
import { logout } from '../app/features/authSlice';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../lib/constants';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const Navbar = () => {
    const [selectedCity, setSelectedCity] = useState('Mumbai');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

    const dispatch = useDispatch();
    const getAvatar = useSelector((state) => state.auth.avatar);
    const isDarkMode = useSelector((state) => state.theme.darkMode);
    const city = useSelector((state) => state.auth.city);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const cityName = capitalizeFirstLetter(city);
        setSelectedCity(cityName);
    }, [city]); // Updated dependency to `city` to reflect Redux state changes

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                withCredentials: true,
            });

            dispatch(logout());
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Placeholder for API call to fetch colleges based on selectedCity
    }, [selectedCity]);

    return (
        <nav
            className={`w-full h-16 sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="font-semibold text-xl text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            Home
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <Button
                                variant="ghost"
                                className="flex items-center text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                            >
                                {selectedCity}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                            {isCityDropdownOpen && (
                                <div className="absolute z-20 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <div className="py-1">
                                        {['Delhi', 'Indore'].map((city) => (
                                            <button
                                                key={city}
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                    setIsCityDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                            >
                                                {city}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/contact"
                            className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Contact Us
                        </Link>
                        <Link
                            to="/review"
                            className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Review Our App
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => dispatch(toggleTheme())}
                            className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={getAvatar} />
                                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                            CN
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                <DropdownMenuGroup>
                                    <Link to="/profile">
                                        <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            Profile
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    >
                                        Log Out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
          
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;