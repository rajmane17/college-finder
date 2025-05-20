import { useQuery, useMutation } from "@tanstack/react-query";
import { handleUserLogin, initiateUserSignup } from "../constants";
import axios from "axios";

export function useUserLogout() {
    return useQuery({
        queryKey: ["user-logout"],
        queryFn: async () => {
            const axiosInstance = axios.create({
                baseURL: import.meta.env.VITE_BASE_URL,
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            })

            const response = await axiosInstance.get("/api/v1/users/logout");
            console.log(response);
        }
    })
}

export function useUserLogin() {
    return useMutation({
        mutationKey: ["user-login"],
        mutationFn: ({email, password}) => handleUserLogin({email, password})
    })
}

export function useInitiateUserSignup(){
        return useMutation({
        mutationKey: ["user-signup"],
        mutationFn: (formData) => initiateUserSignup(formData)
    })
}