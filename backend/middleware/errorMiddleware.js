/* 
*MIDDLEWARE: a function/program that runs when - (after recieving request) && (before sending response)
refering the defination we can say that: 
* app.get('.../:id', (req, res)) { ... } -> it's also a middleware, just because it's the endpoint we aren't using `next` i.e. `(req, res, next)`


*/
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`); // "message" of the error
  res.status(404);  // "status code" of the error
  next(error);      // passing error object PASSED TO IMMEDIATE errorHandler middleware INDIRECTLY
};

const errorHandler = (err, req, res, next) => {
  //if sometimes 200 (OK) -> 500 (i.s.error), since it's not acually OK, we just don't know what is the error, will be useful when debugging
  // if u already know what is the error, then don't change it
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message    = err.message;

  // NOTE: checking for invalid ObjectId moved to it's own middleware
  // See README for further info.

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };


/*
* SUMMARY
  code snippet from errorMiddleware.js, we are defining two middleware functions: notFound and errorHandler.

1. notFound: This middleware is triggered when a route is not found (404 error). It creates an error object with a message indicating the URL that was not found, sets the response status to 404, and passes the error to the next middleware.

2. errorHandler: This middleware handles errors that occur during the processing of a request. 
It determines the status code based on the current response status (changing it to 500 if it was 200), 
extracts the error message, and sends a JSON response with the error message and stack trace 
(in non-production environments).
Additionally, the code mentions that the logic for checking invalid ObjectId has been moved to its own middleware for better organization.
 */

/*
* "stack trace"
In JavaScript, err.stack refers to the stack trace associated with an error object. A stack trace is a textual representation of the call stack at the point where the error occurred. It provides information about the sequence of function calls that led to the error.

The call stack is a data structure that keeps track of the function calls in a program. Each time a function is called, a new entry is pushed onto the call stack. When a function returns, its entry is popped off the stack.

* The stack trace typically includes:

File     names  : Names of the files where the functions are defined.
Line     numbers: Line numbers within those files where the functions are called.
Function names  : Names of the functions in the call stack.

Here's a simple example of a stack trace:

* example:
Error: Something went wrong
    at foo  (example.js:3:9)
    at bar  (example.js:7:5)
    at main (example.js:11:5)

* In this example:
The error occurred in the (function foo) (at line 3) (of example.js)
foo was called by bar at line 7 of example.js.
bar was called by main at line 11 of example.js.

* why stack trace useful?
The stack trace helps developers debug errors by providing information about the sequence of function calls leading up to the error. It's especially useful for identifying the root cause of an error and understanding how the control flow reached a particular point in the code.
 */


/*
* next(error);
-> this will pass the same error object to the next error handling middleware 
-> When you call next(error) in an Express middleware function, 
*it skips the regular middleware and route handlers and directly passes control to the next error-handling middleware
-> When you pass an error object to next(error), the same error object will be received by the error-handling middleware (in your case, the errorHandler middleware).

=> When you call next(error) in an Express middleware function, you're essentially signaling to Express that an error has occurred during the processing of the request, and you're passing that error object along the middleware chain to be handled by an error-handling middleware.
 */