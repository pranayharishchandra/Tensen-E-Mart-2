import { configureStore } from '@reduxjs/toolkit';
// import { configureStore } from '@reduxjs/toolkit/query/react';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;

/**
 * store.js



 * apiSlice.js

==> fetchBaseQuery, createApi  : @reduxjs/toolkit/query/react
==> configureStore, createSlice: @reduxjs/toolkit



 * authSlice.js
-> in "redux" was decided that it will be the only functions which will be used for chaning state
-> "actions" 
-> "reducers" talk to "store" using "useDispatch"
-> to access the "state" we need "useSelector"

> since we are dealing with backend, we will use "createApi" not "createSlice"

==> 'useDispatch, useSelector and Provider' are imported from 'react-redux'

-> whenever there is change in state, the useSelector hook gets activated.


 */
