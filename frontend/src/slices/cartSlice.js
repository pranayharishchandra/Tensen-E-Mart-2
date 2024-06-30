import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };


// object -> name, initialState, reducers
const cartSlice = createSlice({

  name: 'cart',
  initialState, // initialState:initialState

  reducers: {
    addToCart: (state, action) => {
      // NOTE: we don't need user, rating, numReviews or reviews
      // in the cart
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } 
      else {
        state.cartItems = [...state.cartItems, item];
      }

      // return updateCart(state, item);
      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },

    // NOTE: here we need to reset state for when a user logs out so the next
    // user doesn't inherit the previous users cart and shipping
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;
// "CartScreen.jsx": import { addToCart, removeFromCart } from '../slices/cartSlice';
// `actions`: are `parameters`, and  state is changed by `components` like "CartScreen.jsx"

export default cartSlice.reducer;
// "store.js": import cartSliceReducer from './slices/cartSlice';
// `store.js` manages "global state or state", `addToCart: (state, action)` used by `reducers`, so we have to keep exporting the state to "store.js"


/*
* ====================== Actions ======================
* Definition: 
Actions are plain JavaScript objects that have a type field and may have an `optional` payload field.
* Purpose   : 
They describe an event that happened and what should change in the state.
* Example   : 
```
{
  type   : 'counter/increment',
  payload: 1
}
```

* ====================== Reducers ======================
* Definition:
 Reducers are functions that take the current state and an action as arguments and return a new state.
* Purpose:
 They specify how the state changes in response to an action.
* Example:
```
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
```



*/