import { configureStore } from '@reduxjs/toolkit';
// import { configureStore } from '@reduxjs/toolkit/query/react';
import { apiSlice } from './slices/apiSlice';

import cartSliceReducer from './slices/cartSlice'; // export default cartSlice.reducer;
import authReducer      from './slices/authSlice'; // export default authSlice.reducer;
                                                   // it's default export rename to anything you want to

//* just boilerplate code... learn as it is
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer, // now to access state of cart in a component like HomeScreen, "useSelector((state) => state.cart)"
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;

/*
 -apiSlice.js : createApi
 -cartSlice.js: createSlice
*/

/*
 * store.js
==> 


 * apiSlice.js

==> fetchBaseQuery, createApi  : @reduxjs/toolkit/query/react
==> configureStore, createSlice: @reduxjs/toolkit



 * authSlice.js
-> in "redux" was decided that it will be the only functions which will be used for changing state
-> "actions" 
-> "reducers" talk to "store" using "useDispatch"
-> to access the "state" we need "useSelector"

> since we are dealing with backend, we will use "createApi" not "createSlice"

==> 'useDispatch, useSelector and Provider' are imported from 'react-redux'

-> whenever there is change in state, the useSelector hook gets activated.


 */
