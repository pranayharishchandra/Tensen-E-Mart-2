import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); //* "user" is the document, "User" is the model
  // "User" is the model, which is a construct in Mongoose that provides an interface to the MongoDB database for creating, querying, updating, deleting records, etc.

  if (user && (await user.matchPassword(password))) {
    
    generateToken(res, user._id); // generateToken.js for generating token

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } 
  else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true, // This option restricts the cookie to be accessible only by the server and not by client-side scripts, enhancing security.
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  //* authMiddleware: req.user = await User.findById(decoded.userId).select('-password');
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } 
  else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  //* authMiddleware: req.user = await User.findById(decoded.userId).select('-password');
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } 
  else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  //* userRouter.route('/:id').delete(protect, admin, deleteUser)
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } 
  else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } 
  else {
    res.status(404);
    throw new Error('User not found');
  }
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name    = req.body.name || user.name;
    user.email   = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id  : updatedUser._id,
      name : updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } 
  else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};

/** WHY WE DON'T USE NEXT() IN CONTROLLER FUNCTIONS
we can write next in controller funcitons also like
const authUser = asyncHandler(async (req, res, next) => { ... }
but we don't because next don't have any work here because 
routeControllers are "end-points"
*/

/** HOW TO USE NEXT()
  also it's important to NOTE: "next()" DOESN'T WORK LIKE "return" statement

  next() works like:
    ->the statements above next() will get executed ofcourse
    ->then after next() executed then controll will go to the other middleware or controller "functions"
 !!!->then after all the functions are executed, 
    THEN the statements below next() in the middleware also gets executed, 
    people confuse it with "return" 
    that if next() is called then below statemets will never get executed.. 

    you may do like
    next();
    return;

    which is like hack if you don't want below statements to get executed.
 */

/** what are the ways in which we can add our middleware in our controller function

In Express.js, middleware can be added to controller functions in several ways:

1. Inline Middleware:======================================================
You can define middleware functions inline within the route definition. 
This approach is useful for middleware functions that are specific to a particular route handler.


basically: app.get('/route', middleware_function, (req, res) => { ... }

app.get('/route', (req, res, next) => {
  // Inline middleware function <=====
  // Perform middleware logic
  next(); // Call next to proceed to the route handler
}, (req, res) => {
  // Route handler logic
});


2. Global Middleware:======================================================
Middleware functions can be added globally using "app.use()" to be executed on every request that matches the route.


app.use((req, res, next) => {
  // Global middleware function
  // Perform middleware logic
  next(); // Call next to proceed to the next middleware or route handler
});


3. Controller-Specific Middleware:==========================================
You can define middleware functions separately and then reference them in the controller functions.


const middlewareFunction = (req, res, next) => {
  // Middleware logic
  next(); // Call next to proceed to the next middleware or route handler
};

app.get('/route', middlewareFunction, (req, res) => {
  // Route handler logic
});



4. Router-Level Middleware: ======================================================
If you're using routers to organize your routes, you can apply middleware to specific routers.

const router = express.Router();
router.use(middlewareFunction);

router.get('/route', (req, res) => {
  // Route handler logic
});

app.use('/api', router); // Mount router at '/api' prefix


5. Error Handling Middleware: ======================================================
You can define error-handling middleware functions to catch errors that occur during request processing.


app.use((err, req, res, next) => {
  // Error handling middleware function
  // Handle the error
});
 */

/**
User:
i know we have 
1. req.body -> the body parser middleware put the data from the backend in form of object and put in req.body
2. req.headers
3. req.query -> to access query params /?age=23&name=monu and put it in into an object

ChatGPT
Yes, you're correct. Here's a brief explanation of each of the properties you mentioned in the context of an Express.js application:

1. req.body: 
This property contains key-value pairs of data submitted in the request body. 
It is populated by body-parsing middleware such as express.urlencoded() or express.json(). 
This is commonly used when you're submitting data via HTML forms or making POST requests with JSON payloads.

2. req.headers: This property contains the headers sent with the request. Headers are key-value pairs that contain information about the request, such as the user agent, content type, and authorization information. You can access specific headers using req.headers['headerName'].

3. req.query: This property contains the query parameters from the URL. Query parameters are the portion of the URL that follows the ? character and are typically used to pass data to the server as key-value pairs. Express parses these parameters and makes them available in req.query as an object. For example, if the URL is /route?age=23&name=monu, you can access age and name using req.query.age and req.query.name respectively.

These properties (req.body, req.headers, and req.query) are essential for handling different aspects of incoming requests in an Express.js application. They allow you to access data from the request body, headers, and query parameters, enabling you to process and respond to client requests effectively.

User: are there things other than these?
ChatGPT
Yes, in addition to req.body, req.headers, and req.query, there are several other properties available on the req object in Express.js. Here are some common ones:

1. req.params: This property contains route parameters extracted from the URL. Route parameters are specified in the route path and are identified by a colon (:) followed by the parameter name. For example, if your route is defined as /users/:userId, you can access the userId parameter using req.params.userId.

2. req.cookies: This property contains cookies sent by the client in the request headers. It parses the cookie header and provides an object where each key is a cookie name and the value is the corresponding cookie value.

3. req.protocol: This property contains the protocol used by the request (http or https). It is useful for determining whether the request is made over a secure connection.

4. req.path: This property contains the path portion of the request URL. It does not include the query string.

5. req.method: This property contains the HTTP method used by the request (GET, POST, PUT, DELETE, etc.). It allows you to determine the type of request being made.

6. req.ip: This property contains the remote IP address of the client making the request. It provides information about the client's network address.

7. req.url: This property contains the full URL of the request, including the query string.

These properties allow you to access various aspects of the incoming request and extract relevant information needed to process and respond to the client's request effectively in your Express.js application.
 */

/** express.urlencoded() vs express.json()

1. express.urlencoded(): =================================================

This middleware is used to parse incoming requests with URL-encoded payloads. 
It extracts data from the form fields in an HTML form and adds it to the req.body object.
It is commonly used when dealing with HTML form submissions or when submitting data in URL-encoded format.
You can configure this middleware with options to control how the parsing is done, such as setting extended to "true or false to enable or disable extended parsing."

Example:
app.use(express.urlencoded({ extended: true }));


2. express.json(): =================================================

This middleware is used to parse incoming requests with JSON payloads. It extracts JSON data from the request body and adds it to the req.body object.
It is commonly used when dealing with requests that send JSON data in the request body, such as AJAX requests or API requests.
Unlike express.urlencoded(), express.json() does not have configuration options.

Example:
app.use(express.json());

You can choose to use one or both of these middleware functions in your Express application, depending on the types of requests your application needs to handle. 
For example, if your application receives form submissions and JSON data, you would typically use both express.urlencoded() and express.json().


CONCLUSION: 
FORM SUBMISSION                  -> express.urlencoded()
JSON data (eg. fetched from API) -> express.json()
*/

/** FACT ABOUT USING MIDDLEWARE
if you do req.some_key = some_value in middlware
then "next()" is executed 
then req.some_key property can be can also be accessed by the other middleware or the controller function also.

~webdevsimplified - middleware in express in 15 mins
 */