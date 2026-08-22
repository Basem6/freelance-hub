import { configureStore ,  combineReducers } from "@reduxjs/toolkit";
import authReducer from "./Features/authSlice";
import showReducer from "./Features/showSlice";

import {
persistStore,
persistReducer,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
auth: authReducer,
show: showReducer,
});

const persistConfig = {
key: "root",
storage,
whitelist: ["auth"], // احفظ auth فقط
};

const persistedReducer = persistReducer(
persistConfig,
rootReducer
);

export const store = configureStore({
reducer: persistedReducer,

middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
    serializableCheck: false,
    }),
});

export const persistor = persistStore(store);