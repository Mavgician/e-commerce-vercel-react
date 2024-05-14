'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { GCashIcon, PayPalLogo } from "@/components/LocalIcons";

import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Label,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";

import Image from "next/image";
import Link from "next/link";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/scripts/firebase";
import { UserAuth } from "@/scripts/AuthContextProvider";

function CheckoutItem({ image, name, price, seats, type, setTotal, originalQuantity }) {
  useEffect(() => setTotal(price * originalQuantity), []);
  return (
    <div className="d-flex gap-3 mb-3">
      <div style={{ height: 60, width: 60 }} className="d-flex align-items-center flex-shrink-0">
        <Image src={image} alt={name} height={0} width={0} sizes="100%" style={{ height: 'auto', width: '100%' }} />
      </div>
      <div className="flex-grow-1">
        <p className='m-0 fw-bold'>{name}</p>
        <p className='m-0 text-secondary'>{type} - {seats.join(' ')}</p>
      </div>
      <div className="text-end flex-shrink-0">
        <p className="m-0">PHP {price * originalQuantity}.00</p>
        {originalQuantity > 1 && <p className="mt-1 mb-0 text-muted lh-1">PHP {price}.00 <br />each</p>}
      </div>
    </div>
  )
}

function Page({ params }) {
  const [totalPrice, setTotalPrice] = useState(0)
  const [cname, setCname] = useState();

  const searchParams = useSearchParams()
  const router = useRouter()

  const auth = UserAuth()

  const link = `/checkout/receipt/${params.id}`
  const query = {
    c_name: cname
  }

  async function submitHandler(type) {
    let mode = ''
    let user = (await getDoc(doc(db, 'user', auth.user.uid))).data()

    if (!user.orders) user.orders = []
    user.orders = [...user.orders, doc(db, 'orders', params.id)]

    switch (type) {
      case 'gcash':
        mode = 'gcash'
        break
      case 'paypal':
        mode = 'paypal'
        break
      case 'credit-card':
        mode = 'credit-card'
        break
      default:
        mode = 'dev-mode'
        break
    }

    await setDoc(doc(db, 'orders', params.id), {
      c_ref: doc(db, 'users', auth.user.uid),
      claim_type: 'physical reservation',
      payment: {
        amount: totalPrice,
        mode: mode
      },
      seat: {
        location_index: searchParams.getAll('seat'),
        type: searchParams.get('type'),
        type_index: 0
      },
      ticket_ref: doc(db, 'tickets', searchParams.get('ticketID')),
      date: serverTimestamp()
    })

    await setDoc(doc(db, 'user', auth.user.uid), user)
  }

  function cancelHandler() {
    router.back()
  }

  useEffect(() => {
    (async () => {
      if (auth.user.uid) setCname((await getDoc(doc(db, 'user', auth.user.uid))).data().d_name)
    })()
  }, [auth.user]);

  return (
    <main className="p-0 bg-light text-dark">
      <Container>
        <Row>
          <Col md={6} sm={12} className="pt-5">
            <div className="mb-5">
              <p className="m-0">Pay ConFlix</p>
              <h1 className="m-0">PHP {totalPrice}.00</h1>
            </div>
            <div className="mb-5">
              <div className=" w-100">
                <CheckoutItem
                  name={searchParams.get('name')} 
                  price={searchParams.get('price')}
                  image={searchParams.get('image')}
                  seats={searchParams.getAll('seat')}
                  type={searchParams.get('type')}
                  setTotal={setTotalPrice}
                  originalQuantity={parseInt(searchParams.get('quantity'))}
                />
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
                  <Link className="mb-2 btn btn-primary d-block" replace={true} href={{ pathname: link, query: { payment: 'gcash', ...query } }} onClick={e => (submitHandler('gcash'))}>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <GCashIcon color={'white'} />
                      Pay with GCash
                    </div>
                  </Link>
                  <Link className="mb-4 btn btn-warning d-block" replace={true} href={{ pathname: link, query: { payment: 'paypal', ...query } }} onClick={e => (submitHandler('paypal'))}>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <PayPalLogo />
                    </div>
                  </Link>
                  <div className="text-center text-muted mb-4">or pay with card</div>
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
                  <Link className="d-block mt-4 mb-2 btn btn-secondary" replace={true} href={{ pathname: link, query: { payment: 'credit card', ...query } }} onClick={e => (submitHandler('credit-card'))}>
                    Pay PHP {totalPrice}.00
                  </Link>
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