/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */

import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import axios from "axios"
import { signup } from "../../app/features/authSlice"
import OTPInput from "./otp-login/OtpInput";

const SignupForm = () => {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [tempUserData, setTempUserData] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        city: "",
        avatar: "",
        password: "",
        applicantType: null
    })


    // Add email validation function
    const isValidEmail = (email) => {
        return /^[\w.-]+@[\w.-]+\.(ac|edu|res)\.in$/.test(email);
    };

    const validateForm = () => {

        //input data validation
        if (!formData.fullName.trim()) {
            setError('Please enter your full name');
            setIsLoading(false);
            return false;
        } else if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
            setError('Full name should only contain letters and spaces');
            setIsLoading(false);
            return false;
        }

        if (!isValidEmail(formData.email)) {
            setError('Please enter a valid student email address');
            setIsLoading(false);
            return false;
        }

        if (!formData.avatar) {
            setError('Please upload a profile picture');
            setIsLoading(false);
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return false;
        }

        if (!formData.city) {
            setError('Please select a city');
            setIsLoading(false);
            return false;
        }

        if (formData.applicantType !== "admission seeker" && formData.applicantType !== "reviewer") {
            setError('Please select an applicant type');
            setIsLoading(false);
            return false;
        }

        return true;
    }

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            // 1. Create a new FormData object
            const formDataToSend = new FormData();

            // 2. Loop through formData and add each key-value pair to FormData
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            // 3. Send the form data to the server using Axios
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/users/initiate-signup`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true // Include credentials in the request
                }
            );
            // console.log(response);

            // store temperory users data
            setTempUserData(response.data.data);
            setShowOtpInput(true);
        } catch (err) {
            handleError(err);
        } finally {
            setIsLoading(false);
        }

    }

    const handleOTPVerification = async (otpValue) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/users/verify-otp`,
                {
                    email: formData.email,
                    otp: otpValue
                },
                {
                    withCredentials: true
                }
            );

            localStorage.setItem('accessToken', response.data.data.accessToken);

            const userData = response.data.data.createdUser;

            const user = {
                fullName: userData.fullName,
                email: userData.email,
                accessToken: response.data.data.accessToken,
                avatar: userData.avatar,
                city: userData.city,
                applicantType: userData.applicantType
            }

            dispatch(signup(user));
            navigate('/');

        } catch (error) {
            handleError(error);
        }finally {
            setIsLoading(false)
        }
    }

    const handleError = (err) => {
        if (err.response) {
            switch (err.response.status) {
                case 409:
                    setError('Email already exists');
                    break;
                case 400:
                    setError(err.response.data.message || 'Invalid information');
                    break;
                case 401:
                    setError('Invalid OTP');
                    break;
                case 500:
                    setError('Server error. Please try again later.');
                    break;
                default:
                    setError('Operation failed. Please try again.');
            }
        } else if (err.request) {
            setError('No response from server. Check your internet connection.');
        } else {
            setError('An unexpected error occurred');
        }
    };

    return (
        <div class="min-h-screen bg-black flex items-center justify-center p-4">
            {!showOtpInput ? <div class="w-full max-w-2xl p-6 space-y-6 rounded-lg bg-neutral-900 text-white">
                <div class="space-y-2">
                    <h1 class="text-2xl font-semibold">Create an account</h1>
                    <p class="text-neutral-400">
                        Enter your details below to create your account
                    </p>
                </div>

                {error && (
                    <div class="p-4 rounded-md bg-red-900/50 border border-red-500 text-red-200">
                        <p class="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label htmlFor="fullName" class="block text-sm">
                                Full name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => {
                                    setFormData({ ...formData, fullName: e.target.value })
                                }}
                                class="w-full px-3 py-2 rounded-md bg-black border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                            />
                        </div>

                        <div class="space-y-2">
                            <label htmlFor="email" class="block text-sm">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value })
                                }}
                                placeholder="m@example.com"
                                class="w-full px-3 py-2 rounded-md bg-black border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                            />
                        </div>

                        <div class="space-y-2">
                            <label htmlFor="password" class="block text-sm">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value })
                                }}
                                class="w-full px-3 py-2 rounded-md bg-black border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                            />
                        </div>

                        <div class="space-y-2">
                            <label htmlFor="city" class="block text-sm">
                                City
                            </label>
                            <select
                                id="city"
                                value={formData.city}
                                onChange={(e) => {
                                    setFormData({ ...formData, city: e.target.value })
                                }}
                                class="w-full px-3 py-2 rounded-md bg-black border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                            >
                                {/* make a api call over here later on and generate the options */}
                                <option value="">Select a city</option>
                                <option value="mumbai">Mumbai</option>
                                <option value="delhi">Delhi</option>
                                <option value="bangalore">Bangalore</option>
                                <option value="hyderabad">Hyderabad</option>
                                <option value="chennai">Chennai</option>
                                <option value="kolkata">Kolkata</option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label htmlFor="avatar" class="block text-sm">
                                Profile Picture
                            </label>
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setFormData({ ...formData, avatar: e.target.files[0] })
                                }}
                                class="w-full px-3 py-2 rounded-md bg-black border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm">Applicant Type</label>
                        <div class="flex space-x-4">
                            <div class="flex items-center">
                                <input
                                    type="radio"
                                    id="admissionSeeker"
                                    name="applicantType"
                                    value="admission seeker"
                                    checked={formData.applicantType === "admission seeker"}
                                    onChange={(e) => {
                                        setFormData({ ...formData, applicantType: e.target.value })
                                    }}
                                    class="w-4 h-4 text-white bg-black border-neutral-800 focus:ring-2 focus:ring-neutral-600"
                                />
                                <label htmlFor="admissionSeeker" class="ml-2 text-sm text-neutral-400">
                                    Admission Seeker
                                </label>
                            </div>
                            <div class="flex items-center">
                                <input
                                    type="radio"
                                    id="reviewer"
                                    name="applicantType"
                                    value="reviewer"
                                    checked={formData.applicantType === "reviewer"}
                                    onChange={(e) => {
                                        setFormData({ ...formData, applicantType: e.target.value })
                                    }}
                                    class="w-4 h-4 text-white bg-black border-neutral-800 focus:ring-2 focus:ring-neutral-600"
                                />
                                <label htmlFor="reviewer" class="ml-2 text-sm text-neutral-400">
                                    Reviewer
                                </label>
                            </div>
                            <div class="flex items-center">
                                <input
                                    type="radio"
                                    id="admissionSeeker"
                                    name="applicantType"
                                    value="admission seeker"
                                    checked={formData.applicantType === "admin"}
                                    onChange={(e) => {
                                        setFormData({ ...formData, applicantType: e.target.value })
                                    }}
                                    class="w-4 h-4 text-white bg-black border-neutral-800 focus:ring-2 focus:ring-neutral-600"
                                />
                                <label htmlFor="admissionSeeker" class="ml-2 text-sm text-neutral-400">
                                    Admin
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        onClick={handleInitialSubmit}
                        disabled={isLoading}
                        className="w-full py-2 px-4 rounded-md bg-white text-black font-medium hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-neutral-900 disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : "Create Account"}
                    </button>
                </form>

                <div class="text-center text-sm text-neutral-400">
                    Already have an account?{' '}
                    <Link to="/login" class="text-white hover:underline">
                        Login
                    </Link>
                </div>
            </div> : <OTPInput length={6} onVerify={handleOTPVerification} isLoading={isLoading}/>}
        </div>
    );
};

export default SignupForm;
