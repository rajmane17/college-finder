import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { 
    FLUSH, 
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER 
} from 'redux-persist'

// reducers
import authReducer from "./features/authSlice"
import collegeReducer from "./features/collegeSlice"
import themeReducer from "./features/themeSlice"

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    college: collegeReducer,
    theme: themeReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);