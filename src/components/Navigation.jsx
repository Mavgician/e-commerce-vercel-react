'use client';

import { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import { UserAuth } from '@/scripts/AuthContextProvider';

export function Navigationbar({ transparent = false, isFixed = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const auth = UserAuth();

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar
        expand='md'
        color={transparent ? 'transparent' : 'dark'}
        dark={transparent ? false : true}
        fixed={isFixed ? 'top' : undefined}
        style={transparent ? { boxShadow: 'none' } : null}
      >
        <NavbarBrand href='/' className='d-flex align-items-center'>
          {/* <img src={logo.src} width='40' height='40' /> */}
          <small className='mx-2'>
            <b>ConFlix</b>
          </small>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='text-uppercase fw-bold' navbar>
            <NavItem>
              <NavLink href='/'>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/tickets'>Tickets</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/events'>Events</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/about-us'>About Us</NavLink>
            </NavItem>
          </Nav>
          <Nav className='ms-auto' navbar>
            <NavItem>
              <NavLink href={auth.user ? `/user/${auth.user?.uid}` : '/login'}>
                muahaha
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      {isFixed ? <div className='my-3'>&nbsp;</div> : null}
    </>
  );
}
