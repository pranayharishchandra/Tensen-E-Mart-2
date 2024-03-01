import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  // REDUX-STORE
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}


      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) 
      : 
      (
        <>
          <Meta />
          <h1>All Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />

        </>
      )}
      
    </>
  );
};

export default HomeScreen;


/**  using AXIOS VS REDUX-TOOLKIT
 ==> if you were using "axios" then you need to use 
 -> "useState"  for storing "products"
 -> "useEffect" for fetching the data

 ==> here we are using redux and life is simple
 -> we are provided by: data, loading, error.
 -> since you are already provided the fetched data so no need of using "useState or useEffect" hook.
 */