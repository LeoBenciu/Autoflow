import {configureStore} from '@reduxjs/toolkit'
import searchSlice from './slices/searchSlice'
import { carSearchApi } from './slices/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import userSlice from './slices/userSlice'

const store = configureStore({
    reducer: {
        search: searchSlice,
        [carSearchApi.reducerPath]: carSearchApi.reducer,
        user: userSlice,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(carSearchApi.middleware),
});

setupListeners(store.dispatch);

export default store;