import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: 
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
};
/** initial state
initialState: {
  userInfo: {  
    _id(pin)    : "65aa8e18ade0bc39b37ca81d"
    name(pin)   : "Admin User"
    email(pin)  : "admin@email.com"
    isAdmin(pin): true
  }
}
 */

const authSlice = createSlice({

  name: 'auth',
  initialState,

  reducers: {
    //* setCredentials: LoginScreen.jsx, ProfileScreen.jsx, RegisterScreen.jsx
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },

    // logout: (state, action) => {
    logout: (state) => {
      state.userInfo = null;
      // NOTE: here we need to also remove the cart from storage so the next
      // logged in user doesn't inherit the previous users cart and shipping
      localStorage.clear();
    },
    
  },
});

// exporting 
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;


/*
 * userInfo:
it's global state added to local storage so other components like:
AdminRoute.jsx
Header.jsx
PrivateRoute.jsx
LoginScreen.jsx
*OrderScreen.jsx     : const { userInfo } = useSelector((state) => state.auth);

RegisterScreen.jsx  : const res = await login({ email, password }).unwrap();
*                     dispatch(setCredentials({ ...res }));






*/
