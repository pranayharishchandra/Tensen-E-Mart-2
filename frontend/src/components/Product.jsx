import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <div> {/* Wrap all elements in a single parent element */}
      <Link to={`/product/${product._id}`} style={{textDecoration: 'none'}}>
        <Card className='my-3 p-3 rounded product-card'>
          <Card.Img src={product.image} variant='top' />
          <Card.Body>
            
              <Card.Title as='div' className='product-title'>
                <strong>{product.name}</strong>
              </Card.Title>
            
            <Card.Text as='div'>
              <Rating
                value={product.rating}
                text={`${product.numReviews}`}
              />
            </Card.Text>
            <Card.Text as='h3'>₹{Math.round(product.price * 80)}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </div>
  );
};

export default Product;
