const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // response status code is 200 (which typically indicates success), it is changed to 500 (which indicates a server error) when an error occurs during the processing of a request. This helps differentiate between client-side errors and server-side errors for better error handling and debugging.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // NOTE: checking for invalid ObjectId moved to it's own middleware
  // See README for further info.

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
/**
 * SUMMARY
 * code snippet from errorMiddleware.js, we are defining two middleware functions: notFound and errorHandler.
1. notFound: This middleware is triggered when a route is not found (404 error). It creates an error object with a message indicating the URL that was not found, sets the response status to 404, and passes the error to the next middleware.
2. errorHandler: This middleware handles errors that occur during the processing of a request. It determines the status code based on the current response status (changing it to 500 if it was 200), extracts the error message, and sends a JSON response with the error message and stack trace (in non-production environments).
Additionally, the code mentions that the logic for checking invalid ObjectId has been moved to its own middleware for better organization.
 */