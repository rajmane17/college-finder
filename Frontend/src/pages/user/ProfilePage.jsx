import { useEffect, useState } from 'react';
import { MapPin, PencilIcon } from 'lucide-react';
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

// Model imports
import { DeleteConfirmation, ProfileImageModal, CoverImageModal } from "../index"

const ProfilePage = () => {

  const [isProfileDeleteModelOpen, setIsProfileDeleteModelOpen] = useState(false);
  const [isProfileImageModelOpen, setIsProfileImageModelOpen] = useState(false);
  const [isCoverImageModelOpen, setIsCoverImageModel] = useState(false);

  const userData = useSelector(state => state.auth);
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

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark:bg-gray-900" : "bg-gray-100"}`}>
      {/* Header/Banner */}
      <div className="relative w-full h-48">
        <div className={`w-full h-full ${isDarkMode ? "dark:bg-blue-800" : "bg-blue-700"} group relative`}>
          <img
            className="w-full h-full object-cover transition-all duration-300 " // group-hover:blur-sm
            src={userData?.coverImage}
          />
          {/* Cover Image Edit Button */}
          <button
            onClick={() => setIsCoverImageModel(true)}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <PencilIcon className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="relative -mt-24">
          <div className={`rounded-lg shadow p-6 ${isDarkMode ? "dark:bg-gray-800" : "bg-white drop-shadow-xl"}`}>
            {/* Profile Picture */}
            <div className="absolute -top-16 left-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img
                    src={avatar}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full transition-all duration-300 " // group-hover:blur-sm
                  />
                  {/* Profile Image Edit Button */}
                  <button
                    onClick={() => setIsProfileImageModelOpen(true)}
                    className="absolute top-1 right-1 p-1.5 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <PencilIcon className="w-3 h-3 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rest of the profile content */}
            <div className="ml-36">
              <h1 className={`text-2xl font-bold ${isDarkMode ? "dark:bg-gray-800 text-white" : "bg-white"}`}>{name}</h1>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="mr-1" />
                <span>{city}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => navigate("/edit-profile")}
                  className={`px-4 py-2 rounded-full text-white font-semibold ${isDarkMode ? "dark:bg-blue-500 dark:hover:bg-blue-600" : "hover:bg-blue-700 bg-blue-600"}`}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsProfileDeleteModelOpen(true)}
                  className={`px-6 py-2 text-white 
                                    font-semibold rounded-full shadow-md
                                    transition duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 
                                    ${isDarkMode ? "dark:bg-red-500 dark:hover:bg-red-600" : "hover:bg-red-700 bg-red-600"}`}
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isProfileDeleteModelOpen && <DeleteConfirmation onClose={() => { setIsProfileDeleteModelOpen(false) }} />}

      {/* Edit Avatar Modal */}
      {isProfileImageModelOpen && <ProfileImageModal isOpen={isProfileImageModelOpen} onClose={() => { setIsProfileImageModelOpen(false) }} />}

      {/* Edit Cover Image Modal */}
      {isCoverImageModelOpen && <CoverImageModal isOpen={isCoverImageModelOpen} onClose={() => { setIsCoverImageModel(false) }} />}
    </div>
  );
}

export default ProfilePage;