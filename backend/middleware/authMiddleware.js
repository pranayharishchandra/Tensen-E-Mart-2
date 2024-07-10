import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {

  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

/** 
** You are not modifying the request body. Instead, you are attaching a new property named user to the req (request) object. This is a common practice in Express.js middleware to share user data or other relevant information between middleware functions or with the route handlers that execute after the middleware.


*! After the Middleware
{
  method : 'GET',
  url    : '/api/data',
  headers: {
    'Content-Type' : 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body  : {},
  params: {},
  query : {},
**user: {
    _id    : '1234567890abcdef',
    name   : 'John Doe',
    email  : 'john.doe@example.com',
    isAdmin: false,
      // other user properties, but excluding the password
  },
    // other properties like cookies, session, etc.
}
 */
      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } 
    catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } 

  else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// User must be an admin
const admin = (req, res, next) => {

  if (req.user && req.user.isAdmin) {
    next();
  } 

  else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }

};

export { protect, admin };

/*
* when 401 will be sent to frontend, then followin code snippet will be executed
file: "apiSlice.js"
```
async function baseQueryWithAuth(args, api, extra) {

  const result = await baseQuery(args, api, extra);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
}
```

* if "401" recieved, then in frontend will be logged out, clear user details
* if (result.error && result.error.status === 401) api.dispatch(logout());
*/