// Container: to structure and style the content within a defined width for better visual appeal and responsiveness.
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
// LinkContainer is basically link
// not using normal link, for react-bootstrap styling design
import { LinkContainer } from 'react-router-bootstrap';
// useDispatch: The useDispatch hook in Redux is specifically used for dispatching actions to the Redux store, which in turn triggers state changes. Its main purpose is to send actions to the Redux store to update the state based on the logic defined in the reducers

// useSelector: The useSelector hook in Redux is used to extract data from the (slice here in) Redux store state.
// here, useSelector is used to access the cart and auth state slices from the Redux store, specifically retrieving cartItems and userInfo respectively.  
import { useSelector, useDispatch } from 'react-redux';
// useNavigate for: Programmatic navigation using navigate
import { useNavigate } from 'react-router-dom';

import SearchBox from './SearchBox';

import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';

import lionSvg from "../assets/lion.svg"

const Header = () => {
  // state refers to the Redux store state
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo }  = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  // REDUX-STORE
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      {/* variant 'dark' to make text white/grey | 'light': text-black  */}
      <Navbar className='custom-navbar' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              {/* give svg in image otherwise path will come writing directly like {lionSvg} */}
              <img src={lionSvg} width={40} height={40} alt='Tensen-E-Mart' />
              <span className='brand-name'>Tensen-E-Mart</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle className='toggle-button' />
          
          <Navbar.Collapse id='basic-navbar-nav'>

            {/* Nav is just a bootstrap container, ms-auto is bootstrap class for aligning to right (margin-start) */}
            <Nav className='ms-auto'>

              <SearchBox />

              <LinkContainer to='/cart'>
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {/* pill -> badge circle (default rectangle) */}
                  {cartItems.length > 0 && (
                    <Badge pill className='badge'>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>)}
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Links */}
              {userInfo?.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;


/**
 * Wrapping with header

This is not specifically for future styling but rather for proper structuring and organization of the HTML content, which can also aid in accessibility and SEO.

* Slice
A slice in Redux Toolkit is a container for managing state and actions in Redux. It encapsulates reducer logic and action creators for a specific part of the application state. Slices streamline state management by organizing code, promoting modularity, and reducing boilerplate, enhancing scalability and maintainability in Redux applications.

* collapseOnSelect
The collapseOnSelect prop in the Navbar component from react-bootstrap allows the Navbar to automatically close its mobile menu when a NavItem is selected. This behavior is useful for improving user experience on mobile devices where space is limited, ensuring that the menu collapses after an item is selected.

* bg
primary, success, danger, warning, info, light, dark
 */

/** QUESTIONS: 
============================Conceptual Questions:============================
React Component Lifecycle: How does the React component lifecycle apply to this Header component? What lifecycle methods are being utilized here?

Redux Integration: How is Redux integrated into this component? Explain the purpose of useSelector and useDispatch hooks from Redux Toolkit.

Authentication Flow: Describe the authentication flow implemented in this component. How does it manage user authentication and logout?

React Router: How does React Router handle navigation within this component? What is the purpose of the LinkContainer component from react-router-bootstrap?

Conditional Rendering: How are conditional renderings managed based on the user's authentication status and admin privileges?



============================Interview Questions:============================
Explain the role of each imported module and component in this file.

How does the useSelector hook work in Redux, and what is its purpose?

What is the significance of the resetCart action dispatched during the logout process?

How do you handle asynchronous actions like API calls in Redux Toolkit, and why is it important in this context?

Can you describe the purpose of the Badge component from react-bootstrap?

Explain the use of the useState hook in React, and why isn't it utilized in this component?

How would you optimize this component for performance, especially when dealing with large amounts of cart items or user data?

What are the advantages of using React Router for navigation compared to traditional anchor tags (<a>)?

Discuss the benefits of using React Bootstrap components in this context over standard HTML and CSS.

 */