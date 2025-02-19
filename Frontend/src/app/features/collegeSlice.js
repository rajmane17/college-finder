import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    colleges: [],
    currentCollege: null,
    analytics: null,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        pages: 1,
        limit: 10
    }
}

export const collegeSlice = createSlice({
    name: "colleges",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setColleges: (state, action) => {
            state.colleges = action.payload.colleges;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        setCurrentCollege: (state, action) => {
            state.currentCollege = action.payload;
            state.loading = false;
            state.error = null;
        },
        addCollege: (state, action) => {
            state.colleges.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        setAnalytics: (state, action) => {
            state.analytics = action.payload;
            state.loading = false;
            state.error = null;
        }
    }
})

export const { 
    setLoading, 
    setError, 
    setColleges, 
    setCurrentCollege, 
    addCollege,
    setAnalytics 
} = collegeSlice.actions;

export default collegeSlice.reducer;