// Learn Express Middleware In 14 Minutes- https://youtu.be/lY6icfhap2o
import path          from 'path';
import express       from 'express';
import dotenv        from 'dotenv';
import cookieParser  from 'cookie-parser';
dotenv.config();
import connectDB     from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes    from './routes/userRoutes.js';
import orderRoutes   from './routes/orderRoutes.js';
import uploadRoutes  from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// app.use() is used to mount middleware functions in the middleware stack
// productRoutes, userRoutes, orderRoutes, uploadRoutes are "route handlers"
app.use('/api/products', productRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/upload',   uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} 
else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}


// custom eror handling middleware - use the middleware in the end, so if the 
app.use(notFound);
app.use(errorHandler);

// The errorHandler middleware in the errorMiddleware.js file does not call next(), so the code execution will not proceed to the next middleware after it. This means that the code on line 51 in server.js that comes after app.use(errorHandler) will not be executed
app.listen(port, () =>
console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);


/*
 * ERROR HANDLING
 - to avoid try-catch block we use "asyncHandler"
 - "asyncHandler" is also one 3rd party package, but in this project we han't used that
 - and have used our own CUSTOM-ERROR-HANDLER: with the name "asyncHandler"
 */

/* app.use(express.urlencoded({ extended: true }));

this middleware basically makes the data coming from frontend into an object
and then put that object in req.body

==============================================================================
==> extended: true:
When extended is set to true, the qs library is used to parse the URL-encoded data.
This allows for richer parsing of URL-encoded data, including nested objects and arrays.
-> For example, with extended: true, data like name=John&age=30 would be parsed as 
{ name: 'John', age: '30' }.

==> extended: false:
When extended is set to false, the built-in querystring module is used to parse the URL-encoded data.
This option is more limited in terms of parsing capabilities. It treats the data as a flat object.
-> For example, with extended: false, data like name=John&age=30 would be parsed as 
{ 'name': 'John', 'age': '30' }.

==> Conclusion
In most cases, extended: true is preferred because it offers more flexibility in parsing complex data structures. However, if you're working with simpler form data and don't need nested objects or arrays, extended: false can be sufficient and may provide a slight performance improvement because it uses the built-in querystring module, which is lightweight.
*/


/** REQUEST RESPONSE CYCLE
The request-response cycle is a fundamental concept in web development that describes the 
flow of communication between a:
-> "client" (such as a web browser) and a "server" (such as an application server) during the handling of an HTTP request and response.

Here's a brief overview of the request-response cycle:

1. Client Sends Request:
  The cycle begins when a client (e.g., a web browser) sends an HTTP request to a server. 
  The request contains information such as the "HTTP method" (e.g., GET, POST), the URL of the resource being requested, request headers, and optionally a request body (for POST and PUT requests).

2. Server Processes Request:
  Upon receiving the request, the server processes it based on the "specified route" and HTTP "method". This involves routing the request to the appropriate handler, executing middleware functions, and performing any necessary business logic or data manipulation.

3. Server Generates Response:
  After processing the request, the server generates an "HTTP response". This "response" includes a "status code" (indicating the success or failure of the request), "response headers" (providing metadata about the response), and optionally a response body (containing the requested data or other content).

4. Client Receives Response:
  The server sends the HTTP response back to the client over the network. The client receives the response, interprets the "status code and headers", and processes the "response body" if present.

5. Cycle Completes:
  With the response received, the request-response cycle completes. The client may render the received content (e.g., HTML, JSON) to the user, or perform further actions based on the response data.

Throughout the request-response cycle, communication occurs between the client and server, enabling the exchange of data and interactions between users and web applications. Understanding the request-response cycle is crucial for building and debugging web applications effectively.
 */
