const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;

/*
* The ``asyncHandler`` function is a higher-order function (HOF) 
that wraps asynchronous route handlers to simplify error handling in Express.js applications. It allows you to use asynchronous code without needing to wrap each route handler in a try-catch block.


* A higher-order function (HOF) is a function that does at least one of the following:
* 1. `Takes` one or more `functions` as arguments.
* 2. `Returns` a `function` as its result.
*/


/* 
*when our code throws the error then it will be catched by this custom error handler right?

Yes, the asyncHandler middleware in asyncHandler.js is designed to catch errors that occur during "asynchronous" operations and pass them to the next function, which is "typically an error handler" middleware in Express.js.

*/