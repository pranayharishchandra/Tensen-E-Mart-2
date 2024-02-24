import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function NotFoundScreen() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1>404 - Not Found</h1>
          <p>Sorry, the page you are looking for does not exist.</p>
          <LinkContainer to="/">
            <Button variant="primary">Go to Home</Button>
          </LinkContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFoundScreen;