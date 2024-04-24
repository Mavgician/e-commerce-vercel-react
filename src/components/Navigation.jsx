'use client'

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

import { UserAuth } from '@/scripts/AuthContextProvider'

export function Navigationbar() {
  const [isOpen, setIsOpen] = useState(false)
  const auth = UserAuth()

  function toggle() {
    setIsOpen(!isOpen)
  }
  
  return (
    <Navbar expand='md' color='dark' dark fixed='top'>
      <NavbarBrand href='/' className='d-flex align-items-center'>
        {/* <img src={logo.src} width="40" height="40" /> */}
        <small className='mx-2'><b>ConFlix</b></small>
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className='text-uppercase fw-bold' navbar>
          <NavItem>
            <NavLink href='/shopping/women'>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='/shopping/men'>Tickets</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='/shopping/kids'>Events</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='/shopping/kids'>About Us</NavLink>
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
  )
}