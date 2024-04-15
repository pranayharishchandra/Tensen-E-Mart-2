const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;

/* 
*when our code throws the error then it will be catched by this custom error handler right?

Yes, the asyncHandler middleware in asyncHandler.js is designed to catch errors that occur during asynchronous operations and pass them to the next function, which is "typically an error handler" middleware in Express.js.

*/