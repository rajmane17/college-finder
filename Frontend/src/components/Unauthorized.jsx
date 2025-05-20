/* eslint-disable react/no-unescaped-entities */
import { useNavigate } from 'react-router-dom';
import { LockIcon, HomeIcon, LogInIcon } from 'lucide-react';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-red-100">
                        <LockIcon size={32} className="text-red-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>

                <p className="text-gray-600 mb-6">
                    Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() =>navigate('/')}
                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <HomeIcon size={16} className="mr-2" />
                        Return to Home
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <LogInIcon size={16} className="mr-2" />
                        Sign in with a different account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized
