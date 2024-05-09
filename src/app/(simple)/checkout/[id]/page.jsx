'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GCashIcon, PayPalLogo } from "@/components/LocalIcons";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Card
} from "reactstrap";

function Page({ params }) {
  const randPrice = Math.floor((Math.random() * 500) + 50)
  const [items, setItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(randPrice)

  const router = useRouter()

  function cancelHandler() {
    /* deleteDocument('order-receipt-test', params.id) */
    router.back()
  }

  function payHandler() {
    router.push(`/checkout/receipt/${params.id}`)
  }

  useEffect(() => {
    localStorage.setItem('price', randPrice.toString())
  }, [])

  return (
    <main className="p-0">
      <Container>
        <Row>
          <Col md={6} sm={12} className="pt-5">
            <div className="mb-5">
              <p className="m-0">Pay Silkroad</p>
              <h1 className="m-0">PHP {totalPrice}.00</h1>
            </div>
            <div className="mb-5">
              <div className=" w-100">
                {

                }
                <Row className="mt-4">
                  <Col md={10} sm={10} className="d-flex gap-3">
                    <div style={{ width: 60 }} className="flex-shrink-0"></div>
                    <div className="text-truncate flex-shrink-1">
                      Subtotal
                    </div>
                  </Col>
                  <Col md={2} sm={2} className="text-end">
                    PHP {totalPrice}
                  </Col>
                </Row>
                <hr />
                <Row className="fs-4">
                  <Col md={6} sm={6} className="d-flex gap-3">
                    <div style={{ width: 60 }} className="flex-shrink-0"></div>
                    <div className="text-truncate flex-shrink-1">
                      Total due
                    </div>
                  </Col>
                  <Col md={6} sm={6} className="text-end fw-bold">
                    PHP {totalPrice}.00
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col md={6} sm={12}>
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="w-75">
                <div>
                  <Button block color="primary" className="mb-2" onClick={payHandler}>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <GCashIcon color={'white'} />
                      Pay with GCash
                    </div>
                  </Button>
                  <Button block color="warning" className="mb-4" onClick={payHandler}>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <PayPalLogo />
                    </div>
                  </Button>
                  <div className="separator text-muted mb-4">or pay with card</div>
                  <p className='my-2 fs-4'>Shipping Information</p>
                  <FormGroup>
                    <Label>
                      Email
                    </Label>
                    <Input
                      type="email"
                    />
                  </FormGroup>
                  <p className="mb-2">
                    Shipping address
                  </p>
                  <Input placeholder="Name" className="my-2" />
                  <Input placeholder="Address" className="my-2" />
                  <p className='my-2 mt-4 fs-4'>Payment Details</p>
                  <p className="mb-2">
                    Card Information
                  </p>
                  <Input placeholder="1234-5678-9012-3456" className="my-2" />
                  <Row>
                    <Col md={6} sm={12}>
                      <Input placeholder="MM / YY" className="my-2" />
                    </Col>
                    <Col md={6} sm={12}>
                      <Input placeholder="CVC" className="my-2" />
                    </Col>
                  </Row>
                  <FormGroup check>
                    <Input
                      type="checkbox"
                    />
                    <Label check>
                      Billing address is same as shipping
                    </Label>
                  </FormGroup>
                  <Button block className="mt-4 mb-2" onClick={payHandler}>
                    Pay PHP {totalPrice}.00
                  </Button>
                  <Button block color="danger" onClick={cancelHandler}>Cancel</Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default Page