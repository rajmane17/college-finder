import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    fullName: "",
    city: "",
    password: "",
    email: "",
    avatar: null,
    applicantType: null,
    accessToken: null,
    isAuthenticated: false,
    error: null,
    loading: false
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const { fullName, email, accessToken, avatar, city, applicantType } = action.payload;
            state.fullName = fullName;
            state.email = email;
            state.accessToken = accessToken;
            state.avatar = avatar;
            state.city = city;
            state.applicantType = applicantType;
            state.isAuthenticated = true;
            state.error = null;
        },
        signup: (state, action) => {
            const { fullName, email, accessToken, avatar, city, applicantType } = action.payload;
            state.fullName = fullName;
            state.email = email;
            state.accessToken = accessToken;
            state.avatar = avatar;
            state.city = city;
            state.applicantType = applicantType;
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: () => {
            return initialState;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

// ye components me kam aaenge
export const { login, signup, logout, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;