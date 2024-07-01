import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

// The outer parentheses () in JavaScript are used to wrap the object literal {} being returned to ensure that the object is treated as a single expression.
// ({}) It helps clarify the boundaries of the object being returned and can sometimes be used for readability and to avoid syntax errors.
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // === QUERY ===

    //* query method is @GET by default
    
    getProducts: builder.query({ 
      query: ({ keyword, pageNumber }) => ({
        url   : PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5, // value in seconds, This is how long RTK Query will keep your data cached for after the last component unsubscribes. For example, if you query an endpoint, then unmount the component, then mount another component that makes the same request within the given time frame, the most recent value will be served from the cache.
      providesTags     : ['Products'],
    }),
    
    // see the comments for better understanding of why not query returing object
    getProductDetails: builder.query({
      query: (productId) =>    `${PRODUCTS_URL}/${productId}`, // direcly writing without putting in an object and giving "key as url"
      keepUnusedDataFor: 5,
    }),

      // @GET top 3 products for carousel
    getTopProducts: builder.query({
      query            : () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),

      // === MUTATIONS ===
    createProduct: builder.mutation({
      query: () => ({
        url   : `${PRODUCTS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation({
      query: (data) => ({
        url   : `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body  : data,
      }),
      invalidatesTags: ['Products'],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url   : `/api/upload`,
        method: 'POST',
        body  : data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url   : `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Product'],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url   : `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body  : data,
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});


/*
here in the above snippet the 
useGetProductsQuery
is the first endpoint i.e. getProducts
which is being exported right?

and  all the hooks are respective endpoints of productApiSlice 
*/
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetTopProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
} = productsApiSlice;


/*
* Yes, getProducts is a function that is defined using the query method within the builder object in the productsApiSlice.js file.

* The query method is:
 a method provided by the builder object in the RTK Query library. It is used to define a query endpoint that fetches data from a specified URL with optional parameters.


* No, the query method is not the same as useGetProductsQuery. 
query is used to define the endpoint configuration, while useGetProductsQuery is a generated hook that is used to make the actual API call and retrieve the data in a React component.
*/


/*
* invalidatesTags and providesTags are both used in the context of caching and data management in API slices.

* providesTags:
 specifies the tags associated with the data provided by a query or mutation, helping manage cached data and invalidating it when necessary.

* invalidatesTags:
 specifies the tags that should be invalidated when a mutation is performed, ensuring that any cached data associated with these tags is updated or removed after a mutation to maintain data consistency across the application.
 
 * ==> Invalidating refers to:
  the process of marking cached data as outdated or no longer valid. When data is invalidated, it is typically removed from the cache or marked for update to ensure that the most recent and accurate data is fetched from the server when needed. This helps maintain data consistency and integrity within the application.

  * V.IMP: we must "invalidateTags" so the "same old information don't stays" in the page we do mutations in the page

  * In detail: 
  Yes, using invalidatesTags in mutations is important to ensure that any cached data associated with specific tags is updated or removed after a mutation. This helps maintain data consistency and prevents old information from persisting on the page after mutations are performed.
 */


/*
*-> If you don't write providesTags:
 in the builder method for a query or mutation, the data returned by that query or mutation will not be associated with any specific tags for caching purposes. This means that the data won't be managed or cached based on any specific tags, potentially leading to a lack of control over how the data is cached or invalidated in the application.

*-> Caching is important
 in applications to improve performance by storing frequently accessed data in memory. It helps reduce the need to make repeated network requests, resulting in faster response times and a better user experience. Caching can also help reduce server load and network traffic, making the application more efficient overall.

*/

/*
*A hook 
is a function in React that allows you to "use state" and other React features in functional components. 
Hooks enable you to "reuse logic across components", manage component state, and tap into React features without writing a class component. 
*/

/**
 * No, useGetProductDetailsQuery is not a custom hook. 
 * It is a generated hook created by the builder.query method from the productsApiSlice.js file.
 * builder.query -> automatically use the GET method
 */

  /** -> both the snippets are same... 
    -> if you don't write url and direcly give the url without an object so it considers it as url automatically.

 * snippet 1
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    
  * snippet 2
      getProductDetails: builder.query({
        query: (productId) =>    `${PRODUCTS_URL}/${productId}`,
        keepUnusedDataFor: 5,
      }),
 */

/** providesTags and invalidatesTags
providesTags and invalidatesTags are used in the context of caching and data management in API slices.

* providesTags: Specifies the tags associated with the data provided by a query or mutation. This helps in managing cached data and invalidating it when necessary. It allows other parts of the application to subscribe to changes related to these tags.

* invalidatesTags: Specifies the tags that should be invalidated when a mutation is performed. This ensures that any cached data associated with these tags is updated or removed after a mutation, maintaining data consistency across the application.

==> providesTags helps manage cached data by associating tags with query or mutation results. invalidatesTags specifies which tags should be updated or removed when a mutation occurs, maintaining data consistency.
 */