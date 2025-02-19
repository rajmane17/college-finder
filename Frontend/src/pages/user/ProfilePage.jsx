/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { User, MapPin } from 'lucide-react';
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import DeleteConfirmation from './DeleteConfirmation';

const ProfilePage = () => {

  const userData = useSelector(state => state.auth);
  const [showModel, setShowModel] = useState(false);

  const city = (userData.city).toUpperCase();
  const name = (userData.fullName).toUpperCase();
  const avatar = userData.avatar;

  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const navigate = useNavigate();


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);


  function handleEditProfile(){
    //
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark:bg-gray-900" : "bg-gray-100"} `}>
      {/* Header/Banner */}
      <div className={`w-full h-48 ${isDarkMode ? "dark:bg-blue-800" : "bg-blue-700"}`}>
        <img 
        className="w-full h-full object-cover"
        src={userData.coverImg} />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="relative -mt-24">
            <div className={`rounded-lg shadow p-6 ${isDarkMode ? "dark:bg-gray-800" : "bg-white"}`}>
            {/* Profile Picture */}
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <img size={64} src={avatar} className="text-gray-400 dark:text-gray-500 rounded-full" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="ml-36">
              <h1 className={`text-2xl font-bold ${isDarkMode ? "dark:bg-gray-800 text-white" : "bg-white"}`}>{name}</h1>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="mr-1" />
                <span>{city}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleEditProfile}
                  className={`px-4 py-2 rounded-full text-white font-semibold ${isDarkMode ? "dark:bg-blue-500 dark:hover:bg-blue-600" : "hover:bg-blue-700 bg-blue-600"}`}
                 >
                  Edit Profile
                </button>
                <button 
                  onClick={() => setShowModel(true)}
                className={`px-6 py-2 text-white 
                font-semibold rounded-full shadow-md
                transition duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                 ${isDarkMode ? "dark:bg-red-500 dark:hover:bg-red-600" : "hover:bg-red-700 bg-red-600"}`}>
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* This will only appear when show model is true */}
      {showModel && <DeleteConfirmation onClose = {() => {setShowModel(false)}}/> }
    </div>
  );
};

export default ProfilePage;