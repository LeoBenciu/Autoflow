import { configureStore, combineReducers } from "@reduxjs/toolkit";
import searchSlice from "./slices/searchSlice";
import { carSearchApi } from "./slices/apiSlice";
import userSlice from "./slices/userSlice";
import postsSlice from "./slices/postsSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  search: searchSlice,
  [carSearchApi.reducerPath]: carSearchApi.reducer,
  user: userSlice,
  post: postsSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      carSearchApi.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
