import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <i className="bi bi-airplane-fill me-2"></i>
          Blueflights
        </Navbar.Brand>
        <Navbar.Text className="text-light">
          Find the best flight deals across airlines
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Header;