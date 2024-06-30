import { useState, useEffect }            from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col }         from 'react-bootstrap';
import { useDispatch, useSelector }       from 'react-redux';
import Loader                             from '../components/Loader';
import FormContainer                      from '../components/FormContainer';
import { useLoginMutation }               from '../slices/usersApiSlice';
import { setCredentials }                 from '../slices/authSlice';
import { toast }                          from 'react-toastify';



// =================================================================


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/'; //* navigate('/login?redirect=/shipping')


  useEffect(() => {
    if (userInfo) {
      navigate(redirect); // if user already loggedin, and if he opens url of '/login', then he will be direcly navigated to either 'shipping' or 'HomeScreen', like Amazon
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } 
    catch (err) {
      toast.error(err?.data?.message || err.error);
    }

  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary'>
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;


/*
* URLSearchParams
const params = new URLSearchParams('?search=hello&filter=world');

console.log(params.get('search')); // Output: hello
console.log(params.get('filter')); // Output: world

params.append('page', '1');
console.log(params.toString()); // Output: search=hello&filter=world&page=1

 */