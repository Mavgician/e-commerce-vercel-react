'use client'
import { useState, useEffect } from "react"

import {
  Modal,
  ModalBody,
  Card,
  CardHeader,
  CardBody,
  Button
} from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faCancel,
} from '@fortawesome/free-solid-svg-icons'

export function ModalFrame({ submit = () => {isOpen = false}, isOpen, toggle=(e)=>{}, size='l', children }) {
  const [open, setOpen] = useState(isOpen)

  const tog = () => {
    setOpen(!open)
    toggle(prev => {})
  }

  return (
    <Modal toggle={tog} isOpen={isOpen} unmountOnClose={true} centered={true} size={size}>
      <ModalBody className='p-0'>
        <Card className='bg-light shadow border-0'>
          <CardHeader className=" bg-white py-3 px-4">
            {children}
          </CardHeader>
          <CardBody className='d-flex justify-content-end'>
            <Button outline color='danger' className='mx-1' onClick={() => { tog() }}>
              <FontAwesomeIcon icon={faCancel} />
            </Button>
            <Button outline color='success' className='mx-1'
              onClick={() => {
                submit()
                setOpen(false)
              }}>
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  )
}