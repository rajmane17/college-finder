/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../app/features/themeSlice';
import { logout } from "../app/features/authSlice";
import { Link } from "react-router-dom"

//constants
import { capitalizeFirstLetter } from '../lib/constants';

//shadcn imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import axios from 'axios';

const Navbar = () => {

    const [selectedCity, setSelectedCity] = useState("Mumbai");
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

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

    useEffect(() => {
        const cityName = capitalizeFirstLetter(city);
        setSelectedCity(cityName);
    }, [selectedCity])

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/users/logout`, {
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                withCredentials: true
            });

            dispatch(logout());
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // An api call will be made and colleges in that city will be rendered
    }, [selectedCity])

    return (
        <nav className={`w-full ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-gray-400 text-zinc-800'} sticky top-0 z-50`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="font-bold text-xl ml-2">Home</a>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <Button
                            variant="ghost"
                            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}>
                                {selectedCity}
                                <ChevronDown className="h-5 w-5" />
                            </Button>
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
                        <Link to={"/contact"} className={buttonVariants({ variant: "ghost" })}>Contact us</Link>
                        <Link to={"/review"} className={buttonVariants({ variant: "ghost" })}>Review our app</Link>

                        <button
                            onClick={
                                () => {
                                    //humara state update ho raha hai, bs changes visible nhi hai
                                    dispatch(toggleTheme());
                                }
                            }
                            className="p-2 rounded-md hover:bg-gray-100 hover:text-black cursor-pointer"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarImage src={getAvatar} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <a href="/profile">
                                        <DropdownMenuItem>
                                            Profile
                                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </a>
                                    <DropdownMenuItem>
                                        Billing
                                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Settings
                                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Keyboard shortcuts
                                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>Team</DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Email</DropdownMenuItem>
                                                <DropdownMenuItem>Message</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>More...</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem>
                                        New Team
                                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>GitHub</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuItem disabled>API</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Log out
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;