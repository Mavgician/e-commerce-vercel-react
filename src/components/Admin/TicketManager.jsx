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
  setDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

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

import {
  SeatRenderer,
  intToLetter
} from '@/components/Tickets'

import Link from 'next/link';
import { ModalFrame } from '@/components/SimpleModal';
import { useFilePicker } from 'use-file-picker';

import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator
} from 'use-file-picker/validators'

// Set viewable document limit
const doc_limit = 5;

// Firebase references for fetching
const collectionRef = collection(db, 'tickets');
const queryRef = query(collectionRef, orderBy('title'), limit(doc_limit));

function SeatType({ setter, allseats, index }) {
  const [price, setPrice] = useState(allseats[index]?.price ? allseats[index].price : 0);
  const [type, setType] = useState(allseats[index]?.type ? allseats[index].type : '');
  const [seatsTable, setSeatsTable] = useState(allseats[index]?.seats_dimension ? allseats[index].seats_dimension : { column: 1, row: 1 });

  const [viewable, isViewable] = useState(true);

  const updateSeatIndex = (e, type = '') => {
    let temp = [];
    let seats = allseats
    let formData = e.target.value
    let data = { available: true }

    switch (type) {
      case 'price':
        data.price = formData
        break
      case 'type':
        data.type = formData
        break
      case 'table':
        for (let i = 0; i < formData.column; i++) {
          for (let x = 0; x < formData.row; x++) {
            temp.push(`${intToLetter(i)}${x + 1}`);
          }
        }
        data.seats_dimension = formData
        break;
      default:
        break
    }

    data.seats = temp
    seats[index] = { ...allseats[index], ...data }
    setter(seats)
  }

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
            <SeatRenderer table={seatsTable} callBack={(dim) => { updateSeatIndex({ target: { value: dim } }, 'table') }} />
          </FormGroup>
        </Col>
      </Row>
    </Container>
  )
}

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

function SetTicketModal({ isOpen, toggle, update = false, setUpdate = (e) => { }, data, id }) {
  const jsdate = data?.details?.date.toDate()
  const calendardate = `${jsdate?.getFullYear()}-${("0" + (jsdate?.getMonth() + 1)).slice(-2)}-${("0" + jsdate?.getDate()).slice(-2)}T${("0" + (jsdate?.getHours())).slice(-2)}:${("0" + (jsdate?.getMinutes())).slice(-2)}`

  // State for input forms
  const [title, setTitle] = useState(data?.title ? data.title : '');
  const [description, setDescription] = useState(data?.description ? data.description : '');

  const [seatDetails, setSeatDetails] = useState(data?.seat ? data.seat : [{ seats: [], available: false }]);

  const [artist, setArtist] = useState(data?.details?.artist ? data.details.artist : '');
  const [genre, setGenre] = useState(data?.details?.genre ? data.details.genre : '');
  const [location, setLocation] = useState(data?.details?.location ? data.details.location : '');
  const [date, setDate] = useState(data?.details?.date ? calendardate : '');

  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(['jpg', 'png']),
      new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
      new ImageDimensionsValidator({
        maxHeight: 4000, // in pixels
        maxWidth: 4000,
        minHeight: 0,
        minWidth: 8,
      }),
    ],
  });

  const submitHandler = async () => {
    let upload_url = 'https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg'

    if (filesContent.length > 0) {
      const upload_snapshot = await uploadString(ref(getStorage(), filesContent[0].name), filesContent[0].content, 'data_url')
      const upload_ref = upload_snapshot.ref
      upload_url = await getDownloadURL(upload_ref)
    }

    const payload = {
      title: title,
      description: description,
      poster_image_url: upload_url,
      details: {
        artist: artist,
        genre: genre,
        location: location,
        date: Timestamp.fromDate(new Date(date))
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
    <ModalFrame toggle={toggle} isOpen={isOpen} submit={() => { submitHandler() }} size='xl'>
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
              <div className="d-flex align-items-center gap-3 mb-3">
                <Button color='primary' size='sm' onClick={openFilePicker}>Upload Poster Image <FontAwesomeIcon icon={faAdd} /></Button>
                <p className='m-0'>{filesContent[0]?.name}</p>
              </div>
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
          {seatDetails.map((item, idx) => <SeatType key={`stype-${idx}`} setter={setSeatDetails} allseats={seatDetails} index={idx} />)}
        </Form>
      </div>
    </ModalFrame>
  )
}

function TableTicketRow({ data, id, update, updateState }) {
  // Function for each entry in tickets table from firebase
  const [confirmModal, setConfirmModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  function SeatType({ seat_data }) {
    return (
      <>
        <div className='mb-3'>
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
        <td className='text-muted'><p className='m-0' style={{ width: 200, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{data.description}</p></td>
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
            {data.details.date.toDate().toLocaleDateString('ko-KR')}
          </div>
          <div>
            <span className='fw-bold'>Time: </span>
            {`${data.details.date.toDate().toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit", timeZoneName: 'short' })}`}
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
          <Button className='me-2' outline color='info' onClick={() => { setEditModal(true) }}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button className='me-2' outline color='danger' onClick={() => { setConfirmModal(true) }}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </td>
      </tr>
      <ConfirmationModal toggle={setConfirmModal} isOpen={confirmModal} submit={deleteTicket}>You want to delete {id}?</ConfirmationModal>
      <SetTicketModal isOpen={editModal} setUpdate={update} update={updateState} toggle={setEditModal} data={data} id={id} />
    </>
  );
}

export function TicketAdmin() {
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
    <>
      <Card>
        <CardHeader className='d-flex align-items-center'>
          <CardTitle className='m-0 me-1'>
            <h5 className='m-0'>Tickets Database</h5>
          </CardTitle>
          <Button size='sm' className='mx-1' outline onClick={() => setSetTicketModal(true)}>
            <FontAwesomeIcon icon={faAdd} />
          </Button>
          <small className='text-muted me-1 ms-auto'>
            Showing {ticketCount} of {doc_limit}
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
      <SetTicketModal toggle={setSetTicketModal} isOpen={setTicketModal} update={refreshState} setUpdate={setRefreshState} />
    </>
  );
}