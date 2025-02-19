/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import { useRef, useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import {logout} from "../../app/features/authSlice"
import { useNavigate } from "react-router-dom";

function DeleteConfirmation({ onClose }) {

  const modalRef = useRef();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const closeModel = (e) => {
    if (modalRef.current === e.target) {
      onClose()
    }
  }

  async function handleAccountDelete(e) {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    try {

      const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_BASE_URL,
        withCredentials: true, // we can send the credentials 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const response = await axiosInstance.post(`/api/v1/users/check-password`, {
        password: password
      });

      if(response.data.statusCode === 200){
        await axiosInstance.delete("/api/v1/users/delete-user");
        dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // also we need to delete images from cloudinary ==> add that functionality to backend
        return navigate("/login");
      }

    } catch (error) {
      if (error.response){
        switch (error.response.status){
          case 400:
            setError("Please enter your password");
            break;
          case 401:
            setError("Invalid password");
            break;
          case 404:
            setError("User not found");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError("Account Delete failed. please try again later.")
        }
      } else if (error.request) {
        setError('No response from server. Check your internet connection or server is unavailabe temperory.');
      } else {
        setError("An unexpected error occurred.")
      }
    }

  }

  return (
    <div
      ref={modalRef}
      onClick={closeModel}
      className="fixed inset-0 bg-black opacity-80 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="mt-10 flex flex-col gap-5 text-white">
        <button
          className="place-self-end cursor-pointer"
          onClick={onClose}
        >
          <X />
        </button>

        <div className="bg-slate-800 rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4">
          {error && (
            <h3 className="text-xl font-medium text-center text-red-400">{error}</h3>
          )}
          <h1 className="text-3xl font-bold">
            Your Account Will Be Permanently Deleted
          </h1>

          <div className="flex flex-col gap-3 w-fit">
            <p className="text-xl font-medium whitespace-nowrap">
              To confirm, please enter your password in the box below
            </p>
            <form>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                placeholder="Type here..."
                className="w-full p-2 text-white bg-[#121212] border border-red-500 rounded-md outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                required
                onClick={handleAccountDelete}
                className="w-full p-2 text-white bg-[#121212] border border-red-500 rounded-md outline-none focus:ring-2 focus:ring-red-500 mt-2"
              >
                Delete my Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmation
