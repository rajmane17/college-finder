/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [error, setError] = useState("")

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)){
            setError("Please enter a valid email id");
            return;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md rounded-lg shadow-2xl p-8 border border-gray-800 bg-neutral-900">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
                    <p className="text-gray-400">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <Mail className='text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5'/>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-10 py-2 bg-black border-neutral-800 border rounded-md text-white placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparen"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {submitStatus.message && (
                        <div className={`p-4 rounded-md ${submitStatus.type === 'error'
                                ? 'bg-red-900/50 text-red-200 border border-red-800'
                                : 'bg-green-900/50 text-green-200 border border-green-800'
                            }`}>
                            <p>{submitStatus.message}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-md text-black font-medium
              ${isSubmitting
                                ? 'bg-neutral-500 cursor-not-allowed'
                            : 'bg-white hover:bg-neutral-200 focus:outline-none focus:ring-2 transition-colors focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900'
                            }`}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => window.history.back()}
                        className="text-white hover:text-neutral-300 font-medium focus:outline-none"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;