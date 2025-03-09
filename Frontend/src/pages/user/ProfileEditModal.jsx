/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { editProfile } from "../../app/features/authSlice"

const ProfileEditModal = ({ isOpen = false, onClose = () => {}, initialData = {} }) => {
    const modalRef = useRef();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        city: ''
    });

    // Track if form has been modified
    const [isModified, setIsModified] = useState(false);

    // Initialize form with existing data
    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                city: initialData.city || ''
            });
        }
    }, [initialData]);

    // Handle background click
    const handleBackgroundClick = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Check if any field is different from initial data
            setIsModified(
                newData.fullName !== initialData?.fullName ||
                newData.city !== initialData?.city
            );
            return newData;
        });
    };

    const handleError = (error) => {
        if(error.response){
            switch(error.response.status){
                case 400:
                    setError("At least one field is required to update");
                    break;
                default:
                    setError("User Details updation failed, please try again later");
                    break;
            }
        } else if (error.request) {
            setError("No response from server.Check your internet connection or try again later.")
        } else {
            setError("An unexpected error occurred.");
        }
    }

    // Handle form submission
    const handleSubmit = async () => {
        if (!isModified) return;

        setIsLoading(true);
        setError('');

        try {
            const accessToken = localStorage.getItem("accessToken");

            const axiosInstance = axios.create({
                baseURL: `${import.meta.env.VITE_BASE_URL}`,
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            const response = await axiosInstance.patch("/api/v1/users/update-details", formData);

            // Updating the store
            dispatch(editProfile(response.data.data));

            onClose();
        } catch (error) {
            handleError(error)
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            onClick={handleBackgroundClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-4 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Full Name Input */}
                    <div className="space-y-2">
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* City Input */}
                    <div className="space-y-2">
                        <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700"
                        >
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your city"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isModified || isLoading}
                            className={`px-4 py-2 rounded-md text-white ${!isModified || isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditModal;