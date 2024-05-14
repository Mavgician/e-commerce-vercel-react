'use client'

import Image from "next/image"

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'

import { SectionHeader } from "@/components/PageLayout"

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap"

import { collection, doc } from "firebase/firestore"
import { db } from "@/scripts/firebase"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { ModalFrame } from "@/components/SimpleModal"

import { SeatRenderer } from "@/components/Tickets"

function BuyModal({ isOpen, toggle, seats, id, name, image }) {
  const [type, setType] = useState(0);
  const [seatIndex, setSeatIndex] = useState(['A1']);
  const [quantity, setQuantity] = useState(1);

  const query = {
    ticketID: id,
    name: name,
    seat: seatIndex,
    type: seats && seats[type].type,
    price: seats && parseFloat(seats[type].price),
    quantity: quantity,
    image: image,
  }

  function seatSelect(index) {
    if (quantity > 1 && seatIndex.length < quantity && !seatIndex.includes(index)) setSeatIndex(prev => [...prev, index])
    else if (quantity === 1 || seatIndex.length >= quantity) setSeatIndex([index])
  }

  return (
    <ModalFrame toggle={toggle} isOpen={isOpen} size="lg" link={{ pathname: `/checkout/${doc(collection(db, '_')).id}`, query: query }} replace={true}>
      <b>
        <p>
          <big>Get tickets</big>
        </p>
      </b>
      <Row>
        <Col>
          <FormGroup>
            <Label>Select seating type</Label>
            <Input
              placeholder='Type'
              type='select'
              value={type}
              onChange={e => setType(parseInt(e.target.value))}
            >
              {seats?.map((data, idx) => <option key={data} value={idx}>{data.type}</option>)}
            </Input>
          </FormGroup></Col>
        <Col xs={2} s={2} md={2} lg={2}>
          <FormGroup>
            <Label>QTY</Label>
            <Input
              placeholder='quantity'
              type='select'
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value))}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>

      <p>
        <big>Select your seat/s: <b>{seatIndex.join(' ')}</b></big>
      </p>
      <SeatRenderer
        table={seats && seats[type].seats_dimension}
        disabled={false} className="d-inline-block pb-0"
        height={'auto'}
        onClick={seatSelect}
      />
    </ModalFrame>
  )
}

export default function Page({ params }) {
  const [values, loading, error, snapshot] = useDocumentDataOnce(doc(db, 'tickets', params.ticketid));
  const [buyModal, setBuyModal] = useState(false);

  const date = values?.details?.date.toDate()

  function buyHandler() {
    setBuyModal(true)
  }

  return (
    <main className="py-5">
      <Container>
        <SectionHeader>
          Tickets
        </SectionHeader>
        <Row>
          <Col className="d-flex justify-content-end">
            <Image src={values?.poster_image_url} alt='' height={0} width={0} sizes='100%' style={{ height: 'auto', width: '70%' }} />
          </Col>
          <Col className="px-4">
            <div className="d-flex align-items-center mb-3">
              <h1 className="m-0 text-warning">{values?.title}</h1>
              <Button onClick={buyHandler} className="ms-4" color="danger" outline>Get tickets</Button>
            </div>
            <Row>
              <Col xs={2} s={2} md={2} lg={2}>
                <h5 className="my-0">Artist:</h5>
                <h5 className="my-0">Location:</h5>
                <h5 className="my-0">Date:</h5>
                <h5>Time:</h5>
              </Col>
              <Col className="text-info">
                <h5 className="my-0">{values?.details?.artist}</h5>
                <h5 className="my-0">{values?.details?.location}</h5>
                <h5 className="my-0">{date ? `${date.toLocaleDateString('ko-KR')}` : ''}</h5>
                <h5>{date ? `${date.toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit", timeZoneName: 'short' })}` : ''}</h5>
              </Col>
            </Row>
            <p className="my-2">{values?.description}</p>
          </Col>
        </Row>
      </Container>
      <BuyModal id={params.ticketid} isOpen={buyModal} toggle={setBuyModal} seats={values?.seat} name={values?.title} image={values?.poster_image_url} />
    </main>
  )
}