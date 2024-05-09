'use client';

import { useState, useEffect } from 'react';

import { db } from '@/scripts/firebase';
import {
  collection,
  getCountFromServer,
  query,
  limit,
  orderBy,
  getDocs,
  startAfter,
  endBefore,
  limitToLast,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  addDoc,
} from 'firebase/firestore';

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
  Col,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faEdit,
  faAdd,
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import { ModalFrame } from '@/components/SimpleModal';
import { useRouter } from 'next/navigation';

// Set viewable document limit
const doc_limit = 5;

// Firebase references for fetching
const collectionRef = collection(db, 'tickets');
const queryRef = query(collectionRef, orderBy('title'), limit(doc_limit));

const intToLetter = (index) => {
  let letter = '';
  let repeat = Math.floor(Math.log(index) / Math.log(26));

  if (repeat > 1) {
    letter += intToLetter(index / 26);
  }

  letter += String.fromCharCode((index % 26) + 'A'.charCodeAt(0));

  return letter;
};

const SeatType = ({ setter, allseats, index }) => {
  const [price, setPrice] = useState(0);
  const [type, setType] = useState('Type');
  const [seatsTable, setSeatsTable] = useState({ column: 1, row: 1 });

  const [viewable, isViewable] = useState(true);

  let temp = [];

  const SeatRenderer = ({ table }) => {
    let final_table = [];

    for (let i = 0; i < table.column; i++) {
      let column = [];
      for (let x = 0; x < table.row; x++) {
        column.push(
          <div
            className='m-1 border d-flex align-items-center justify-content-center'
            style={{ height: 40, width: 40, flexShrink: 0 }}
            key={`${intToLetter(i)}${x + 1}`}
          >
            {`${intToLetter(i)}${x + 1}`}
          </div>
        );
      }

      final_table.push(
        <div className='d-flex' key={`column-${intToLetter(i)}`}>
          {column}
          <div
            className='m-1'
            style={{ height: 40, width: 45, flexShrink: 0 }}
          ></div>
        </div>
      );
    }

    return (
      <div className={'pb-5'} style={{ height: 120, overflow: 'auto' }}>
        {final_table}
      </div>
    );
  };

  const updateSeatIndex = (e, type = '') => {
    let seats = allseats
    let formData = e.target.value
    let data = { availability: true }
    let tempSize = {}

    //TODO: This part is bugged. I don't know how to fix it or how the bug works.
    //Bug Description: tempSize of seats table is misaligned with expected output

    switch (type) {
      case 'price':
        data.price = formData
        break
      case 'type':
        data.type = formData
        break
      case 'column':
        tempSize = { ...seatsTable, column: parseInt(formData) }
      case 'row':
        tempSize = { ...seatsTable, row: parseInt(formData) }

        for (let i = 0; i < tempSize.column; i++) {
          for (let x = 0; x < tempSize.row; x++) {
            temp.push(`${intToLetter(i)}${x + 1}`);
          }
        }

        data.seats = temp
        break

      default:
        break
    }

    seats[index] = { ...allseats[index], ...data }
    setter(seats);
  };

  return (
    <Container>
      <div
        className='d-flex align-items-center mt-3'
        onClick={() => {
          isViewable(!viewable);
        }}
        style={{ cursor: 'pointer' }}
      >
        <b>
          <p className='m-0 me-4'>{type}</p>
        </b>
        <hr className='me-4' style={{ flexGrow: 1 }} />
        <FontAwesomeIcon icon={viewable ? faArrowUp : faArrowDown} />
      </div>
      <Row className={viewable ? null : 'd-none'}>
        <Col s={12} md={4}>
          <FormGroup>
            <Label>Seat Type</Label>
            <Input
              placeholder='Type'
              value={type}
              onChange={(e) => {
                setType(e.target.value)
                updateSeatIndex(e, 'type');
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Price</Label>
            <Input
              placeholder='Price'
              type='number'
              value={price}
              onChange={(e) => {
                setPrice(parseInt(e.target.value))
                updateSeatIndex(e, 'price');
              }}
            />
          </FormGroup>
        </Col>
        <Col s={12} md={2}>
          <FormGroup>
            <Label>Seat Row</Label>
            <Input
              placeholder='Row'
              type='number'
              value={seatsTable.row}
              onChange={(e) => {
                setSeatsTable({
                  column: seatsTable.column,
                  row: parseInt(e.target.value),
                });
                updateSeatIndex(e, 'row')
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Seat Column</Label>
            <Input
              placeholder='Column'
              type='number'
              value={seatsTable.column}
              onChange={(e) => {
                setSeatsTable({
                  column: parseInt(e.target.value),
                  row: seatsTable.row,
                });
                updateSeatIndex(e, 'column')
              }}
            />
          </FormGroup>
        </Col>
        <Col s={12} md={6}>
          <FormGroup>
            <Label>Seats View</Label>
            <SeatRenderer table={seatsTable} />
          </FormGroup>
        </Col>
      </Row>
    </Container>
  );
};

function ConfirmationModal({ submit, isOpen, toggle, children }) {
  return (
    <ModalFrame toggle={toggle} isOpen={isOpen} submit={submit}>
      <div className='text-danger mb-3 d-block fw-bold'>
        <big>Are you sure?</big>
      </div>
      <p>{children}</p>
    </ModalFrame>
  );
}

function SetTicketModal({ isOpen, toggle, update, setUpdate }) {
  // State for input forms
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [seatDetails, setSeatDetails] = useState([{seats: [], available: false}]);

  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const [imageurl, setImageurl] = useState('https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg');

  const submitHandler = async (id) => {
    const payload = {
      title: title,
      description: description,
      poster_image_url: imageurl,
      details: {
        artist: artist,
        genre: genre,
        location: location,
        date: serverTimestamp()
      },
      seat: seatDetails
    }

    if (id) await setDoc(doc(db, 'tickets', id), payload)
    else await addDoc(collection(db, 'tickets'), payload)

    setUpdate(!update)
    return toggle(false)
  }

  const textFieldHandler = (setter, e) => {
    setter(e.target.value);
  };

  const addType = () => {
    setSeatDetails([...seatDetails, {}])
  };

  return (
    <ModalFrame toggle={toggle} isOpen={isOpen} submit={submitHandler} size='xl'>
      <div className='text-muted mb-3'>
        <b>
          <p>
            <big>Add a ticket</big>
          </p>
        </b>
        <p className='m-0 mb-1'>
          <b>Generic Details</b>
        </p>
        <Form>
          <Row>
            <Col s={12} md={6}>
              <FormGroup>
                <Label>Event Title</Label>
                <Input
                  placeholder='Title'
                  value={title}
                  onChange={(e) => {
                    textFieldHandler(setTitle, e);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Col>
                  <Input
                    placeholder='description'
                    type='textarea'
                    value={description}
                    onChange={(e) => {
                      textFieldHandler(setDescription, e);
                    }}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col s={12} md={6}>
              <Row>
                <Col sm={12} md={6}>
                  <FormGroup>
                    <Label>Artist Name</Label>
                    <Input
                      placeholder='Name'
                      value={artist}
                      onChange={(e) => {
                        textFieldHandler(setArtist, e);
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Event Date</Label>
                    <Input
                      placeholder='Date'
                      type='datetime-local'
                      value={date}
                      onChange={(e) => {
                        textFieldHandler(setDate, e);
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>Event Genre</Label>
                    <Input
                      placeholder='Genre'
                      type='select'
                      value={genre}
                      onChange={(e) => {
                        textFieldHandler(setGenre, e);
                      }}
                    >
                      <option>Rock</option>
                      <option>Jazz</option>
                      <option>Rap</option>
                      <option>Hiphop</option>
                      <option>Dubstep</option>
                      <option>DnB</option>
                      <option>Reggae</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Location</Label>
                    <Input
                      placeholder='Location'
                      value={location}
                      onChange={(e) => {
                        textFieldHandler(setLocation, e);
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className='d-flex mb-1 align-items-center'>
            <p className='m-0 me-2'>
              <b>Seat Details</b>
            </p>
            <Button size='sm' onClick={addType}>
              <FontAwesomeIcon icon={faAdd} />
            </Button>
          </div>
          {seatDetails.map((item, idx) => (
            <SeatType key={`stype-${idx}`} setter={setSeatDetails} allseats={seatDetails} index={idx} />
          ))}
        </Form>
      </div>
    </ModalFrame>
  );
}

function TableTicketRow({ data, id, update, updateState }) {
  // Function for each entry in tickets table from firebase
  const [confirmModal, setConfirmModal] = useState(false);

  function SeatType({ seat_data }) {
    return (
      <>
        <div>
          <p className='m-0'>
            <span className='fw-bold'>Seat type:</span> {seat_data.type}
          </p>
          <p className='m-0'>
            <span className='fw-bold'>Available:</span>{' '}
            {`${seat_data.available}`}
          </p>
          <p className='m-0'>
            <span className='fw-bold'>price:</span> {seat_data.price}
          </p>
          <p className='m-0'>
            <span className='fw-bold'>Available Seats:</span>{' '}
            {seat_data.seats.length}
          </p>
        </div>
      </>
    );
  }

  async function deleteTicket() {
    await deleteDoc(doc(db, 'tickets', id))
    update(!updateState)
    setConfirmModal(false)
  }

  return (
    <>
      <tr>
        <td className='pl-4 text-muted'>
          <span>{id}</span>
        </td>
        <td>
          <span className='text-muted'>{data.title}</span>
        </td>
        <td className='text-muted'>{data.description}</td>
        <td className='text-muted'>
          <div>
            <span className='fw-bold'>Artist: </span>
            {data.details.artist}
          </div>
          <div>
            <span className='fw-bold'>Genre: </span>
            {data.details.genre}
          </div>
          <div>
            <span className='fw-bold'>Location: </span>
            {data.details.location}
          </div>
          <div>
            <span className='fw-bold'>Date: </span>
            {/* data.details.date.toDate().toString() */}
          </div>
        </td>
        <td className='text-muted'>
          {data.seat.map((seat, idx) => (
            <SeatType key={`${data.id}-${idx}-seat`} seat_data={seat} />
          ))}
        </td>
        <td className='text-muted'>
          <span className='fw-bold'>Image url: </span>
          <Link href={data.poster_image_url}>link</Link>
        </td>
        <td>
          <Button className='me-2' outline color='danger' onClick={() => { setConfirmModal(true) }}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </td>
      </tr>
      <ConfirmationModal toggle={setConfirmModal} isOpen={confirmModal} submit={deleteTicket}>You want to delete {id}?</ConfirmationModal>
    </>
  );
}

function Page() {
  const [docs, setDocs] = useState([]);
  const [ticketCount, setTicketCount] = useState(0);

  const [lastSeenDoc, setLastSeenDoc] = useState();
  const [firstSeenDoc, setFirstSeenDoc] = useState();

  const [setTicketModal, setSetTicketModal] = useState(false);

  const [refreshState, setRefreshState] = useState(false);

  function setDocStates(snapshot) {
    if (snapshot.docs.length === 0) return;
    setDocs(snapshot.docs);
    setLastSeenDoc(snapshot.docs[snapshot.docs.length - 1]);
    setFirstSeenDoc(snapshot.docs[0]);
  }

  async function getNextPage() {
    const snapshot = await getDocs(query(queryRef, startAfter(lastSeenDoc)));
    setDocStates(snapshot);
  }

  async function getPreviousPage() {
    const snapshot = await getDocs(
      query(queryRef, endBefore(firstSeenDoc), limitToLast(doc_limit))
    );
    setDocStates(snapshot);
  }

  // Set states on page load
  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(queryRef);
      const count = await getCountFromServer(collectionRef);

      snapshot.docs.forEach((doc, idx) => {
        if (idx == snapshot.docs.length - 1) setLastSeenDoc(doc);
        if (idx == 0) setFirstSeenDoc(doc);
      });

      setTicketCount(count.data().count);
      setDocs(snapshot.docs);
    })();
  }, [refreshState]);

  return (
    <main>
      <Container className='p-5'>
        <Card>
          <CardHeader className='d-flex align-items-center'>
            <CardTitle className='m-0 me-1'>
              <h5 className='m-0'>Add tickets to database</h5>
            </CardTitle>
            <Button size='sm' className='mx-1' outline onClick={() => setSetTicketModal(true)}>
              <FontAwesomeIcon icon={faAdd} />
            </Button>
            <small className='text-muted me-1 ms-auto'>
              Showing {doc_limit} of {ticketCount}
            </small>
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
                    <th className='col-2'>ID</th>
                    <th className='col-1'>Title</th>
                    <th className='col-2'>Description</th>
                    <th className='col-2'>Details</th>
                    <th className='col-2'>Seat Details</th>
                    <th className='col-1'>Image/s</th>
                    <th className='col-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <TableTicketRow
                      data={doc.data()}
                      id={doc.id}
                      key={doc.id}
                      update={setRefreshState}
                      updateState={refreshState}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
        <SetTicketModal toggle={setSetTicketModal} isOpen={setTicketModal} update={refreshState} setUpdate={setRefreshState}/>
      </Container>
    </main>
  );
}

export default Page;
