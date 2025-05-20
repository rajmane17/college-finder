import axios from 'axios'

export function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const handleUserLogin = async ({ email, password }) => {
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_BASE_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const response = await axiosInstance.post('/api/v1/users/login', {
        email,
        password
    });

    const data = response.data.data;

    // setting tokens in local storage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    const userData = response.data.data.user;

    // we need to inform the store about the login
    const user = {
        fullName: userData.fullName,
        email: userData.email,
        accessToken: userData.accessToken,
        avatar: userData.avatar,
        city: userData.city,
        applicantType: userData.applicantType
    }
    return user;
}

export const initiateUserSignup = async() => {
    //
}