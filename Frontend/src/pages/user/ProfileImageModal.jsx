/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useRef } from 'react';
import axios from "axios";
import { X, Upload, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { editAvatar } from "../../app/features/authSlice";

const ProfileImageModal = ({ isOpen = false, onClose = () => { } }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [tempImage, setTempImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const modalRef = useRef();
    const dispatch = useDispatch();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);

        // This will help to show the image preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    setError("Avatar file is required");
                    break;
                case 500:
                    setError("Error while uploading avatar");
                    break;
                default:
                    setError("Account Delete failed. Please try again later.");
                    break;
            }
        } else if (error.request) {
            setError("No response from server. Check your internet connection or try again later.");
        } else {
            setError("An unexpected error occurred.");
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!selectedImage) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('avatar', selectedImage);

            const accessToken = localStorage.getItem("accessToken");

            const axiosInstance = axios.create({
                baseURL: `${import.meta.env.VITE_BASE_URL}`,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const response = await axiosInstance.patch("/api/v1/users/update-avatar", formData);

            const avatar = response.data.data.avatar;
            dispatch(editAvatar(avatar));

            onClose();
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Edit Profile Picture</h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                            {tempImage ? (
                                <img
                                    src={tempImage}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="w-full">
                                <button
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    Choose Photo
                                </button>
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>

                            <button
                                onClick={handleSave}
                                disabled={!selectedImage || isLoading}
                                className={`w-full px-4 py-2 rounded-md text-sm font-medium text-white 
                  ${!selectedImage || isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>

                            {error && (
                                <div className="mt-2 px-4 py-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileImageModal;
