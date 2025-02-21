/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { editCoverImg } from "../../app/features/authSlice"
import axios from 'axios'

function CoverImageModal({ isOpen = false, onClose = () => { } }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [coverImg, setCoverImg] = useState(null);
    const [tempCoverImg, setTempCoverImg] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [straighten, setStraighten] = useState(0);

    const dispatch = useDispatch();
    const modalRef = useRef();

    if (!isOpen) return null;

    function handleError(error) {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    setError("Cover image file is required");
                    break;
                case 500:
                    setError("Error while uploading cover image");
                    break;
                default:
                    setError("Cover image updation failed, please try again later");
                    break;
            }
        } else if (error.request) {
            setError("No response from server.Check your internet connection or try again later.")
        } else {
            setError("An unexpected error occurred.");
        }
    }

    function closeModal(e) {
        if (modalRef.current == e.target) {
            onClose();
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setCoverImg(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempCoverImg(reader.result)
            }
            reader.readAsDataURL(file);
        }
    }

    const handleSave = async () => {
        if (!coverImg) return;
        setIsLoading(true);

        try {
            const formData = new FormData;
            formData.append("coverImage", coverImg);

            const accessToken = localStorage.getItem("accessToken");

            const axiosInstance = axios.create({
                baseURL: `${import.meta.env.VITE_BASE_URL}`,
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })

            const response = await axiosInstance.patch("/api/v1/users/update-coverimage", formData);

            const coverImage = response.data.data.coverImage;
            dispatch(editCoverImg(coverImage));
            onClose();

        } catch (error) {
            handleError(error)
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div
            ref={modalRef}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Background photo</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Image Preview */}
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        {coverImg ? (
                            <img
                                src={tempCoverImg}
                                alt="Profile preview"
                                className="w-full h-full object-cover transition-transform duration-200"
                                style={{
                                    transform: `scale(${zoom}) rotate(${straighten}deg)`
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        {/* Zoom Control */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Zoom</label>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500">-</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="2"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-gray-500">+</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 pt-4">
                        <input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <button
                            onClick={() => document.getElementById('imageInput').click()}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Change photo
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!coverImg || isLoading}
                            className={`px-4 py-2 rounded-md text-white ${!coverImg || isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {isLoading ? 'Saving...' : 'Apply'}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-2 px-4 py-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CoverImageModal
