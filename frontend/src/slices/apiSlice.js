import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
// import { fetchBaseQuery, createApi } from '@reduxjs/toolkit';
import { BASE_URL } from '../constants';

import { logout } from './authSlice'; // Import the logout action

// NOTE: code here has changed to handle when our JWT and Cookie expire.
// We need to customize the baseQuery to be able to intercept any 401 responses
// and log the user out
// (A 401 response is an HTTP status code that indicates the client must authenticate itself to get the requested response. It is commonly used for unauthorized access attempts.)
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-queries-with-basequery

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  // Dispatch the logout action on 401.
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,            // Use the customized baseQuery
  tagTypes: ['Product', 'Order', 'User'], // what type of data we are fetching from backend
  endpoints: (builder) => ({}),          // for interacting with backend
});

/**
 * "createApi": for basically dealing with backend and fetching the data, otherwise we would have used "createSlice" if were not dealing with backend
 * tagTypes: ['Product', 'Order', 'User'] ==> these are type of data what we will be fetching from the backend
 * endpoints: (builder) => ({}),          ==> The "endpoints" property within the "createApi" function 
            is "an object" that defines the API endpoints for interacting with the backend. 
 * baseQuery        : is the function to fetch data from the backend 
 * baseQueryWithAuth: is the function to 
 * baseQueryWithAuth: is a function that acts as a wrapper around the baseQuery function. It intercepts the response from baseQuery, checks if the response has an error with a status of 401 (unauthorized), and if so, it dispatches the logout action using api.dispatch(). This function ensures that if a 401 error occurs, the user is automatically logged out.
 */
