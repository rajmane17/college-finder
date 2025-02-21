import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    fullName: "",
    city: "",
    password: "",
    email: "",
    avatar: null,
    coverImage: null,
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
        logout: (state) => {
            // Clear all sensitive data
            Object.assign(state, initialState);

        },
        editAvatar: (state, action) => {
            state.avatar = action.payload;
        },
        editCoverImg: (state, action) => {
            state.coverImage = action.payload
        },
        EditProfile: (state, action) => {
            // Update only the provided fields
            Object.assign(state, action.payload);
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
export const { login, signup, logout, setError, setLoading, editAvatar, editCoverImg } = authSlice.actions;
export default authSlice.reducer;