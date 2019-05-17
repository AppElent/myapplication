// navBar.jsx
import React, {useState, useEffect, useContext} from 'react'
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withAuth } from '@okta/okta-react';
import { AuthContext } from '../context/AuthContext';

const NavBar = ({auth}) => {
  const { authenticated, admin } = useContext(AuthContext);
  const navbar = () => {

    return <Navbar bg="light" expand="lg" collapseOnSelect>
        <LinkContainer to="/">
          <Navbar.Brand href="#home">My Application</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {authenticated &&
            <><LinkContainer to="/events">
              <Nav.Link>Events</Nav.Link>
            </LinkContainer>
            <NavDropdown title="Rekeningen" id="basic-nav-dropdown">
              <LinkContainer to="/rekeningen">
                <NavDropdown.Item>Rekeningen</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/bunq">
                <NavDropdown.Item>Bunq</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown title="Meterstanden" id="basic-nav-dropdown">
              <LinkContainer to="/meterstanden">
                <NavDropdown.Item>Elektra</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/settings">
              <Nav.Link>Settings</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/logout">
              <Nav.Link>Logout</Nav.Link>
            </LinkContainer></>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  }
  
 
  return navbar()
}

export default withAuth(NavBar)
