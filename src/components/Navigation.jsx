'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
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

  useEffect(() => {}, [auth])

  return (
    <>
      <Navbar
        expand='md'
        color={transparent ? 'transparent' : 'light'}
        fixed={isFixed ? 'top' : undefined}
        style={transparent ? { boxShadow: 'none' } : null}
      >
        <NavbarBrand href='/' className='d-flex align-items-center'>
          {/* <img src={logo.src} width='40' height='40' /> */}
          <small className='mx-2'>
            <b>DNB</b>
          </small>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ms-auto fw-bold' navbar>            
            <NavItem>
              <NavLink href='/'>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/boys'>Boys</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/girls'>Girls</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/cart'>Cart</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/about-us'>About Us</NavLink>
            </NavItem>
            <NavItem style={{ padding: '0px 30px' }}>         
              <NavLink href={auth.user ? `/user/${auth.user?.uid}` : '/login'} 
                style={{
                  color: 'white',
                  backgroundColor: 'rgb(23, 32, 42)',
                  borderRadius: '4px',
                  padding: '6px 30px',
                  pointerEvents: auth.loading ? 'none' : 'auto',
                }}>
                {auth.user ? <FontAwesomeIcon icon={faUser}/> : 'Sign Up' }
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      {isFixed ? <div className='my-3'>&nbsp;</div> : null}
    </>
  );
}
