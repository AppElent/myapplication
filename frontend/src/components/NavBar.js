// navBar.jsx
import React from 'react'
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavBar = () => (
      <Navbar bg="light" expand="lg">
        <LinkContainer to="/">
          <Navbar.Brand href="#home">My Application</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/events">
              <Nav.Link>Events</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/rekeningen">
              <Nav.Link>Rekeningen</Nav.Link>
            </LinkContainer>
            <NavDropdown title="Meterstanden" id="basic-nav-dropdown">
              <LinkContainer to="/meterstanden_warmte">
                <NavDropdown.Item>Warmte</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/meterstanden_elektra">
                <NavDropdown.Item>Elektra</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to="/meterstanden_kosten">
                <NavDropdown.Item>Kostenoverzicht</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
)

export default NavBar
