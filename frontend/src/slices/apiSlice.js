import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
// import { fetchBaseQuery, createApi } from '@reduxjs/toolkit';
import { BASE_URL } from '../constants';

import { logout } from './authSlice'; // Import the logout action


// (A 401 response is an HTTP status code that indicates the client must authenticate itself to get the requested response. It is commonly used for unauthorized access attempts.)
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-queries-with-basequery
// React Redux Toolkit RTK Query Tutorial | RTK Query CRUD | Data Fetching & Caching Tool - 1: https://youtu.be/vsxJSc-Q7CA
// RTK Query CRUD | Mutations & Auto-Fetching | React Redux Toolkit RTK Query Tutorial    - 2: https://www.youtube.com/watch?v=3QLpHlmdW_U

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

// This function ensures that if a 401(unauthorized) error occurs, the user is automatically logged out.
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
  tagTypes: ['Product', 'Order', 'User'], // types of data we are fetching from backend
  endpoints: (builder) => ({}),          //* BUILDER function - we don't need to do - (try-catch), (fetching), (error-handeling), we can do all these using builder
});

/*
* BUILDER FUNCTION : 
In the context of the provided code snippet, builder is a parameter used in the endpoints property within the createApi function. It is a function that defines the API endpoints for interacting with the backend. 
*The builder function allows you to specify the endpoints and their configurations without explicitly handling tasks like try-catch, fetching, and error handling, as these can be managed within the builder function itself. 
*/

/**
 * "createApi": for basically dealing with backend and fetching the data, otherwise we would have used "createSlice" if were not dealing with backend
 * tagTypes: ['Product', 'Order', 'User'] ==> these are type of data what we will be fetching from the backend
 * endpoints: (builder) => ({}),          ==> The "endpoints" property within the "createApi" function 
            is "an object" that defines the API endpoints for interacting with the backend. 
 * baseQuery        : is the function to fetch data from the backend 
 * baseQueryWithAuth: is a function that acts as a wrapper around the baseQuery function. It intercepts the response from baseQuery, checks if the response has an error with a status of 401 (unauthorized), and if so, it dispatches the logout action using 
 "api.dispatch()". This function ensures that if a 401 error occurs, the user is automatically logged out.

 * (args, api, extra): In the baseQueryWithAuth function, the arguments args, api, and extra are automatically passed by the baseQuery function when it calls baseQueryWithAuth. These arguments are part of the mechanism used by the fetchBaseQuery function to pass data and context to the custom query function.
 */
