/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { login } from "../../app/features/authSlice"

const LoginForm = () => {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch()

    // Add email validation function
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!isValidEmail(email)) {
            setError("Please enter a valid email");
            setIsLoading(false);
            return navigate("/login");
        }

        if (!password) {
            setError("Please enter a password");
            setIsLoading(false);
            return navigate("/login");
        }

        try {


            const axiosInstance = axios.create({
                baseURL: import.meta.env.VITE_BASE_URL,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const response = await axiosInstance.post('/api/v1/users/login', {
                email,
                password
            });
            console.log(response);

            const data = response.data.data;

            // setting tokens in local storage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            // console.log("user details: ",response.data.data.user);
            const userData = response.data.data.user;

            // we need to inform the store about the login
            const user = {
                fullName: userData.fullName,
                email: userData.email,
                accessToken: userData.accessToken,
                avatar: userData.avatar,
                city: userData.city,
                applicantType: userData.applicantType
            }
            dispatch(login(user));

            // navigating to home page
            navigate("/")

        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setError("Please enter both email and password");
                        break;
                    case 401:
                        setError("Invalid email or password");
                        break;
                    case 404:
                        setError("User not found");
                        break;
                    case 500:
                        setError('Server error. Please try again later.');
                        break;
                    default:
                        setError("Login failed. please try again later.")
                }
            } else if (error.request) {
                setError('No response from server. Check your internet connection or server is unavailabe temperory.');
            } else {
                setError("An unexpected error occurred.")
            }
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 space-y-6 rounded-lg bg-neutral-900 text-white">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">Login</h1>
                    <p className="text-neutral-400">
                        Enter your email below to login to your account
                    </p>
                </div>

                {error && (
                    <div class="p-4 rounded-md bg-red-900/50 border border-red-500 text-red-200">
                        <p class="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => { setEmail(e.target.value) }}
                            placeholder="m@example.com"
                            className="w-full px-3 py-2 rounded-md bg-black border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="block text-sm">
                                Password
                            </label>
                            <a
                                href="#"
                                className="text-sm text-neutral-400 hover:text-white transition-colors"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            required
                            onChange={(e) => { setPassword(e.target.value) }}
                            className="w-full px-3 py-2 rounded-md bg-black border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-md bg-white text-black font-medium hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-neutral-900"
                    >
                        Login
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-neutral-900 px-2 text-neutral-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full py-2 px-4 rounded-md border border-neutral-800 text-white font-medium hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-600 focus:ring-offset-neutral-900"
                >
                    Login with Google
                </button>

                <div className="text-center text-sm text-neutral-400">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-white hover:underline">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
