import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

// The outer parentheses () in JavaScript are used to wrap the object literal {} being returned to ensure that the object is treated as a single expression.
// ({}) It helps clarify the boundaries of the object being returned and can sometimes be used for readability and to avoid syntax errors.
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
      // === QUERY ===
      // query method is @GET by default
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


/**here in the above snippet the 
useGetProductsQuery
is the first endpoint i.e. getProducts
which is being exported right?

and  all the hooks are respective endpoints of productApiSlice */
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



  /**
 * No, useGetProductDetailsQuery is not a custom hook. It is a generated hook created by the builder.query method from the productsApiSlice.js file.
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