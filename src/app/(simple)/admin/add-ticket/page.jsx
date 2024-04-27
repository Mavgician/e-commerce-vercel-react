'use client'

import { useState, useEffect } from 'react'

import { db } from '@/scripts/firebase'
import {
  collection,
  getCountFromServer,
  query,
  limit,
  orderBy,
  getDocs,
  startAfter,
  endBefore,
  limitToLast
} from 'firebase/firestore'

import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Container,
  Button,
  Table,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faAdd,
  faArrowRight,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

import Link from 'next/link'
import { ModalFrame } from '@/components/SimpleModal'

// Set viewable document limit the query
const doc_limit = 5;

// Firebase references for fetching
const collectionRef = collection(db, 'tickets')
const queryRef = query(collectionRef, orderBy('title'), limit(doc_limit))

function ConfirmationModal({
  submit,
  isOpen,
  children
}) {
  return (
    <ModalFrame isOpen={isOpen} submit={submit}>
      <div className="text-danger mb-3 d-block fw-bold">
        <big>Are you sure?</big>
      </div>
      <p>{children}</p>
    </ModalFrame>
  )
}

function AddTicketModal({ isOpen }) {

  // State for input forms
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()

  const [seatDetails, setSeatDetails] = useState({})

  const [artist, setArtist] = useState()
  const [genre, setGenre] = useState()
  const [location, setLocation] = useState()
  const [date, setDate] = useState()

  const [available, setAvailable] = useState(false)
  const [price, setPrice] = useState(0)
  const [type, setType] = useState()
  const [seats, setSeats] = useState([])

  const [imageurl, setImageurl] = useState()

  function submitHandler() {
    /* let payload = {
      title: title,
      description: description,
      poster_image_url: imageurl,
      details: details,
      seat: seatDetails
    } */
  }

  function textFieldHandler(setter, e) {
    setter(e.target.value)
  }

  return (
    <ModalFrame isOpen={isOpen} submit={submitHandler} size='xl'>
      <div className="text-muted mb-3">
        <big>Add a ticket</big>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label>Event Title</Label>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => { textFieldHandler(setTitle, e) }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Col>
                  <Input
                    placeholder="description"
                    type="textarea"
                    value={description}
                    onChange={(e) => { textFieldHandler(setDescription, e) }}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label>Artist Name</Label>
                    <Input
                      placeholder="Name"
                      value={description}
                      onChange={(e) => { textFieldHandler(setArtist, e) }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Event Date</Label>
                    <Input
                      placeholder="Date"
                      type='datetime-local'
                      value={description}
                      onChange={(e) => { textFieldHandler(setDate, e) }}
                    />
                  </FormGroup>
                </Col >
                <Col>
                  <FormGroup>
                    <Label>Event Genre</Label>
                    <Input
                      placeholder="Genre"
                      type='select'
                      value={description}
                      onChange={(e) => { textFieldHandler(setGenre, e) }}
                    >
                      <option>
                        Rock
                      </option>
                      <option>
                        Jazz
                      </option>
                      <option>
                        Rap
                      </option>
                      <option>
                        Hiphop
                      </option>
                      <option>
                        Dubstep
                      </option>
                      <option>
                        DnB
                      </option>
                      <option>
                        Reggae
                      </option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Location</Label>
                    <Input
                      placeholder="Location"
                      value={description}
                      onChange={(e) => { textFieldHandler(setLocation, e) }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>

        </Form>
      </div>
    </ModalFrame>
  )
}

function TableTicketRow({ data, id }) {
  // Function for each entry in tickets table from firebase

  function SeatType({ seat_data }) {
    return (
      <>
        <div>
          <p className='m-0'><span className='fw-bold'>Seat type:</span> {seat_data.type}</p>
          <p className='m-0'><span className='fw-bold'>Available:</span> {`${seat_data.available}`}</p>
          <p className='m-0'><span className='fw-bold'>price:</span> {seat_data.price}</p>
          <p className='m-0'><span className='fw-bold'>Available Seats:</span> {seat_data.seats.length}</p>
        </div>
      </>
    )
  }

  return (
    <tr>
      <td className="pl-4 text-muted"><span>{id}</span></td>
      <td><span className="text-muted">{data.title}</span></td>
      <td className='text-muted'>{data.description}</td>
      <td className='text-muted'>
        <div>
          <span className='fw-bold'>Artist: </span>{data.details.artist}
        </div>
        <div>
          <span className='fw-bold'>Genre: </span>{data.details.genre}
        </div>
        <div>
          <span className='fw-bold'>Location: </span>{data.details.location}
        </div>
        <div>
          <span className='fw-bold'>Date: </span>{/* data.details.date.toDate().toString() */}
        </div>
      </td>
      <td className='text-muted'>
        {data.seat.map((seat, idx) => <SeatType key={`${data.id}-${idx}-seat`} seat_data={seat} />)}
      </td>
      <td className='text-muted'>
        <span className='fw-bold'>Image url: </span><Link href={data.poster_image_url}>link</Link>
      </td>
      <td>
        <Button className='me-2' outline >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button className='me-2' outline color='danger'>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </td>
    </tr>
  )
}

function Page() {
  const [docs, setDocs] = useState([])
  const [ticketCount, setTicketCount] = useState(0)

  const [lastSeenDoc, setLastSeenDoc] = useState()
  const [firstSeenDoc, setFirstSeenDoc] = useState()

  function setDocStates(snapshot) {
    if (snapshot.docs.length === 0) return
    setDocs(snapshot.docs)
    setLastSeenDoc(snapshot.docs[snapshot.docs.length - 1])
    setFirstSeenDoc(snapshot.docs[0])
  }

  async function getNextPage() {
    const snapshot = await getDocs(query(queryRef, startAfter(lastSeenDoc)))
    setDocStates(snapshot)
  }

  async function getPreviousPage() {
    const snapshot = await getDocs(query(queryRef, endBefore(firstSeenDoc), limitToLast(doc_limit)))
    setDocStates(snapshot)
  }

  // Set states on page load
  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(queryRef)
      const count = await getCountFromServer(collectionRef)

      snapshot.docs.forEach((doc, idx) => {
        if (idx == snapshot.docs.length - 1) setLastSeenDoc(doc)
        if (idx == 0) setFirstSeenDoc(doc)
      })

      setTicketCount(count.data().count)
      setDocs(snapshot.docs)
    }
    )();
  }, [])

  return (
    <main>
      <Container className='p-5'>
        <Card>
          <CardHeader className='d-flex align-items-center'>
            <CardTitle className='m-0 me-1'>
              <h5 className='m-0'>Add tickets to database</h5>
            </CardTitle>
            <Button size='sm' className='mx-1' outline>
              <FontAwesomeIcon icon={faAdd} />
            </Button>
            <small className='text-muted me-1 ms-auto'>Showing {doc_limit} of {ticketCount}</small>
            <Button color='transparent' size='sm' onClick={getPreviousPage}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button color='transparent' size='sm' onClick={getNextPage}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </CardHeader>
          <CardBody>
            <div className='table-responsive'>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th className="col-2">ID</th>
                    <th className="col-1">Title</th>
                    <th className="col-2">Description</th>
                    <th className="col-2">Details</th>
                    <th className="col-2">Seat Details</th>
                    <th className="col-1">Image/s</th>
                    <th className="col-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map(doc => <TableTicketRow data={doc.data()} id={doc.id} key={doc.id} />)}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
        <ConfirmationModal>test</ConfirmationModal>
        <AddTicketModal isOpen={true}></AddTicketModal>
      </Container>
    </main>
  )
}

export default Page