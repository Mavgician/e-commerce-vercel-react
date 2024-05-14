'use client';

import { useState, useEffect, createContext, useContext } from 'react';

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
  getDoc,
  setDoc,
  documentId,
  FieldPath,
} from 'firebase/firestore';

import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Button,
  Table,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Label
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faArrowRight,
  faArrowLeft,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

import { ModalFrame } from '@/components/SimpleModal';
import Link from 'next/link';
import Image from 'next/image';
import { deleteUser, getAuth, reauthenticateWithCredential } from 'firebase/auth';

const userContext = createContext()

// Set viewable document limit
const doc_limit = 5;

// Firebase references for fetching
const collectionRef = collection(db, 'user');
const queryRef = query(collectionRef, orderBy('last_name'), limit(doc_limit));

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

function Order({ orderReference, orderArray = [], update, updateState }) {
  const [order, setOrder] = useState({
    seat: {
      type: 'seatType',
      location_index: [],
      type_index: 0
    },
    claim_type: 'claimType',
    date: undefined
  });
  const [ticket, setTicket] = useState({
    title: 'ticketTitle',
    poster_image_url: '',
    seat: [
      { price: 0 }
    ]
  });
  const context = useContext(userContext)

  const [ID, setID] = useState(0);
  const [loading, setLoading] = useState(true);

  async function deleteOrder() {
    const index = orderArray.indexOf(orderReference)
    const payload = { ...context.user }
    orderArray.splice(index, 1)
    payload.orders = orderArray

    await setDoc(doc(db, 'user', context.id), payload)
    update(updateState + 1)
  }

  useEffect(() => {
    setLoading(true);
    (async () => {
      const ref = await getDoc(orderReference)
      setOrder(ref.data())
      setTicket((await getDoc(ref.data().ticket_ref)).data())
      setID(ref.data().ticket_ref.id)
      setLoading(false)
    })()
  }, []);

  return (
    !loading &&
    <div className='d-flex'>
      <Link href={`/tickets/${ID}`} className='bg-light text-dark rounded p-3 border d-block mb-3 text-decoration-none flex-grow-1'>
        <b>
          <p className='m-0'>{ticket.title}</p>
        </b>
        <div className='d-flex mb-2'>
          <p className='m-0 me-3'>Price: PHP {ticket.seat[order.seat.type_index].price}</p>
          <p className='m-0 me-3'>Seat: {order.seat.type} - {order.seat.location_index.join(' ')}</p>
          <p className='m-0 me-3'>Type: {order.claim_type}</p>
        </div>
        <p className='text-secondary m-0'>Order ID: {orderReference.id}</p>
        <p className='text-secondary m-0'>
          Date: {order.date.toDate().toDateString()} {order.date.toDate().toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit", timeZoneName: 'short' })}
        </p>
      </Link>
      <Button className='mb-3' color='danger' onClick={deleteOrder}><FontAwesomeIcon icon={faTrash} /></Button>
    </div>
  )
}

function SetUserModal({ isOpen, toggle, update = false, setUpdate = (e) => { }, data, id }) {

  // State for input forms
  const [acctType, setAcctType] = useState(data.account_type ? data.account_type : '');
  const [email, setEmail] = useState(data.email ? data.email : '');
  const [dname, setDname] = useState(data.d_name ? data.d_name : '');

  const submitHandler = async () => {
    const payload = {
      ...data,
      account_type: acctType,
      email: email,
      d_name: dname
    }

    await setDoc(doc(db, 'user', id), payload)

    setUpdate(!update)
    return toggle(false)
  }

  const textFieldHandler = (setter, e) => {
    setter(e.target.value);
  };

  return (
    <ModalFrame toggle={toggle} isOpen={isOpen} submit={() => { submitHandler() }} size='xl'>
      <div className='text-muted mb-3'>
        <b>
          <p>
            <big>Edit user</big>
          </p>
        </b>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  placeholder='Email'
                  type='email'
                  value={email}
                  onChange={(e) => {
                    textFieldHandler(setEmail, e);
                  }}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Display Name</Label>
                <Input
                  placeholder='Display name'
                  value={dname}
                  onChange={(e) => {
                    textFieldHandler(setDname, e);
                  }}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Account Type</Label>
                <Input
                  placeholder='Genre'
                  type='select'
                  value={acctType}
                  onChange={(e) => {
                    textFieldHandler(setAcctType, e);
                  }}
                >
                  <option>user</option>
                  <option>admin</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    </ModalFrame>
  )
}

function ReservationModal({ isOpen, toggle, data, userid }) {
  const [update, setUpdate] = useState(0);

  return (
    <ModalFrame isOpen={isOpen} toggle={toggle} size='xl'>
      <h5 className='mb-3'>Orders</h5>
      {data.length > 0 ? data.map(orderRef => <Order key={orderRef.id} orderReference={orderRef} orderArray={data} userid={userid} update={setUpdate} updateState={update} />) : <p>No orders to show</p>}
    </ModalFrame>
  )
}

function TableTicketRow({ data, id, updateCallback, updateState }) {
  // Function for each entry in tickets table from firebase
  const [confirmModal, setConfirmModal] = useState(false);
  const [reserveModal, setReserveModal] = useState(false);
  const [userModal, setUserModal] = useState(false);

  async function removeUser() {
    const auth = getAuth()
    const user = auth.currentUser

    try {
      if (user.uid === id) return alert('You cannot delete your own account.')

      await deleteUser(user)
      await deleteDoc(doc(db, 'user', id))
    } catch (error) {
      return alert('Cannot delete user. Please reauthenticate account.')
    }

    updateCallback(!updateState)
    setConfirmModal(false)
  }

  return (
    <>
      <tr>
        <td className='text-muted'>
          <span>{id}</span>
        </td>
        <td className='text-muted'>
          <span>{data.email}</span>
        </td>
        <td className='text-muted'>
          <span>{data.d_name}</span>
        </td>
        <td className='text-muted'>
          <span>{data.account_type}</span>
        </td>
        <td className='text-muted'>
          <Button size='sm' className='m-0' color='primary' onClick={() => { setReserveModal(true) }}>View ({data.orders.length}) reservation/s</Button>
        </td>
        <td>
          <Button className='me-2' outline color='info' onClick={() => { setUserModal(true) }}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button className='me-2' outline color='danger' onClick={() => { setConfirmModal(true) }}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </td>
      </tr>
      <userContext.Provider value={{ user: data, id, updateState, updateCallback }}>
        <ConfirmationModal toggle={setConfirmModal} isOpen={confirmModal} submit={removeUser}>You want to delete {id}?</ConfirmationModal>
        <ReservationModal isOpen={reserveModal} toggle={setReserveModal} data={data.orders} userid={id} />
        <SetUserModal isOpen={userModal} toggle={setUserModal} data={data} setUpdate={updateCallback} update={updateState} id={id} />
      </userContext.Provider>
    </>
  )
}

export function UserAdmin() {
  const [docs, setDocs] = useState([]);
  const [docCount, setDocCount] = useState(0);

  const [lastSeenDoc, setLastSeenDoc] = useState();
  const [firstSeenDoc, setFirstSeenDoc] = useState();

  const [refreshState, setRefreshState] = useState(false);

  const [sortBy, setSortBy] = useState(queryRef);

  function sortbyHandler(index) {
    let parse = parseInt(index)

    switch (parse) {
      case 0:
        setSortBy(queryRef)
        break;

      case 1:
        setSortBy(query(collectionRef, orderBy(documentId()), limit(doc_limit)))
        break

      case 2:
        setSortBy(query(collectionRef, orderBy('created_at'), limit(doc_limit)))
        break;

      default:
        setSortBy(queryRef)
        break;
    }
  }

  function setDocStates(snapshot) {
    if (snapshot.docs.length === 0) return;
    setDocs(snapshot.docs);
    setLastSeenDoc(snapshot.docs[snapshot.docs.length - 1]);
    setFirstSeenDoc(snapshot.docs[0]);
  }

  async function getNextPage() {
    const snapshot = await getDocs(query(sortBy, startAfter(lastSeenDoc)));
    setDocStates(snapshot);
  }

  async function getPreviousPage() {
    const snapshot = await getDocs(
      query(sortBy, endBefore(firstSeenDoc), limitToLast(doc_limit))
    );
    setDocStates(snapshot);
  }

  // Set states on page load
  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(sortBy);
      const count = await getCountFromServer(collectionRef);

      snapshot.docs.forEach((doc, idx) => {
        if (idx == snapshot.docs.length - 1) setLastSeenDoc(doc);
        if (idx == 0) setFirstSeenDoc(doc);
      });

      setDocCount(count.data().count);
      setDocs(snapshot.docs);
    })();

    console.log('test');
  }, [refreshState]);

  return (
    <>
      <Card>
        <CardHeader className='d-flex align-items-center'>
          <CardTitle className='m-0 me-1'>
            <h5 className='m-0'>User Database</h5>
          </CardTitle>
          <div className='d-flex align-items-center gap-2 ms-auto'>
            <p className="m-0 w-100">Sort by</p>
            <Input
              placeholder='Genre'
              type='select'
              onChange={(e) => { sortbyHandler(e.target.value) }}
            >
              <option value={0}>Name</option>
              <option value={1}>ID</option>
              <option value={2}>Date</option>
            </Input>
          </div>
          <small className='text-muted me-1 ms-3'>
            Showing {docCount} of {docCount < doc_limit ? docCount : doc_limit}
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
                  <th className='col-2'>Email</th>
                  <th className='col-2'>Display Name</th>
                  <th className='col-2'>Type</th>
                  <th className='col-2'>Ticket Reservations</th>
                  <th className='col-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <TableTicketRow
                    data={doc.data()}
                    id={doc.id}
                    key={doc.id}
                    updateCallback={setRefreshState}
                    updateState={refreshState}
                  />
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </>
  );
}