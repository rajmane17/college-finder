/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import { useState, useRef, useEffect } from "react";

export default function OTPInput({ length = 6, onVerify, isLoading }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }

        // If all digits are filled, automatically submit
        if (index === length - 1 && value && !newOtp.includes("")) {
            handleSubmit(newOtp.join(""));
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(0, 1);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, length);
        if (!/^\d+$/.test(pasteData)) return;

        const newOtp = pasteData.split("").concat(new Array(length - pasteData.length).fill(""));
        setOtp(newOtp);

        if (!newOtp.includes("")) {
            handleSubmit(newOtp.join(""));
        }

        inputRefs.current[newOtp.findIndex((val) => val === "") || length - 1]?.focus();
    };

    const handleSubmit = (otpValue) => {
        if (otpValue.length !== length) {
            setError("Please enter all digits");
            return;
        }
        if (timeLeft === 0) {
            setError("OTP has expired. Please request a new one");
            return;
        }
        onVerify(otpValue);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold mb-3 text-white">ENTER VERIFICATION CODE</h2>
            <p className="text-neutral-400 mb-4">
                We've sent a code to your email. Time remaining: {formatTime(timeLeft)}
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
                    {error}
                </div>
            )}

            <div className="flex gap-2 bg-neutral-900 p-4 rounded-lg shadow-lg" onPaste={handlePaste}>
                {otp.map((value, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={value}
                        type="text"
                        maxLength={1}
                        disabled={isLoading}
                        className="w-12 h-12 text-center text-white bg-neutral-700 border-2 border-neutral-600 rounded-lg 
                            focus:outline-none focus:border-gray-400 text-lg transition-all duration-200
                            disabled:opacity-50"
                        onChange={(e) => handleChange(e, index)}
                        onClick={() => handleClick(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                ))}
            </div>

            <button
                onClick={() => handleSubmit(otp.join(""))}
                disabled={isLoading || otp.includes("") || timeLeft === 0}
                className="mt-4 px-6 py-3 bg-gray-400 text-black font-semibold rounded-lg 
                    shadow-md transition-transform transform hover:scale-105 
                    hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600
                    disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
            >
                {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            {timeLeft === 0 && (
                <p className="mt-4 text-red-400">
                    OTP has expired. Please refresh the page to request a new one.
                </p>
            )}
        </div>
    );
}