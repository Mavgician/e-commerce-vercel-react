'use client'

import Link from 'next/link';

import { auth, db } from '@/scripts/firebase';
import { useSignOut } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation'

import {
  Button,
  Container,
  Row,
  Col
} from 'reactstrap'

import { doc, getDoc } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TicketAdmin } from '@/components/Admin/TicketManager';
import { UserAdmin } from '@/components/Admin/UserManager';

function Order({ orderReference }) {
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
  const [ID, setID] = useState(0);
  const [loading, setLoading] = useState(true);

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
    <Link href={`/tickets/${ID}`} className='bg-light text-dark rounded p-3 border d-block mb-3 text-decoration-none'>
      <Row>
        <Col xs={1} sm={1} md={1} lg={1}>
          <Image src={ticket.poster_image_url} height={0} width={0} sizes='100%' style={{ height: 'auto', width: '100%' }} />
        </Col>
        <Col xs={11} sm={11} md={11} lg={11}>
          <h3 className='m-0'>{ticket.title}</h3>
          <div className='d-flex mb-2'>
            <p className='m-0 me-3'>Price: PHP {ticket.seat[order.seat.type_index].price}</p>
            <p className='m-0 me-3'>Seat: {order.seat.type} - {order.seat.location_index.join(' ')}</p>
            <p className='m-0 me-3'>Type: {order.claim_type}</p>
          </div>
          <p className='text-secondary m-0'>Order ID: {orderReference.id}</p>
          <p className='text-secondary m-0'>
            Date: {order.date.toDate().toDateString()} {order.date.toDate().toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit", timeZoneName: 'short' })}
          </p>
        </Col>
      </Row>
    </Link>
  )
}

export default function Page({ params }) {
  const [value, d_loading, d_error, snapshot, reload] = useDocumentDataOnce(doc(db, 'user', params.userID))
  const [signOut, loading, error] = useSignOut(auth);

  const [tab, setTab] = useState(0);
  const [adminTab, setAdminTab] = useState(0);

  const router = useRouter()

  async function logout() {
    await signOut()
    router.replace('/')
  }

  if (d_loading) return <main></main>

  return (
    <main className='bg-light text-dark'>
      <Container className='p-5' fluid>
        <Row>
          <Col xs={2} s={2} md={2} lg={2}>
            <div className='my-3'>
              <Button active={tab === 0} onClick={e => setTab(0)} className='text-start text-secondary' block color='light'>ACCOUNT</Button>
              <Button active={tab === 1} onClick={e => setTab(1)} className='text-start mt-2 text-secondary' block color='light'>TICKET RESERVATIONS</Button>
              {value.account_type === 'admin' && <Button active={tab === 2} onClick={e => setTab(2)} className='text-start mt-2 text-secondary' block color='light'>ADMIN PANEL</Button>}
              <Button className='mt-4' block color='primary' onClick={logout}>Logout</Button>
            </div>
          </Col>
          <Col xs={10} s={10} md={10} lg={10}>
            <div className={tab === 0 ? '' : 'd-none'}>
              <h4>Account Overview</h4>
              <b>
                <p className='m-0'>Name: {value?.first_name} {value?.last_name}</p>
                <p className='m-0'>Username: {value?.d_name}</p>
              </b>
              <div className="d-flex align-items-center gap-3">
                <p>Email: {value?.email}</p>
                <p>Phone: 0912345678</p>
                <p>Account type: {value?.account_type}</p>
              </div>
            </div>
            <div className={tab === 1 ? '' : 'd-none'}>
              <h4>Your Reservations ({value.orders.length})</h4>
              {value.orders.length > 0 ? value.orders.map(order => <Order key={order.id} orderReference={order} />) : <h3 className='text-secondary'>No orders to see here</h3>}
            </div>
            {
              tab === 2 && <div>
                <div className='d-flex align-items-center gap-3'>
                  <h4 className='m-0'>Admin Panel</h4>
                  <div className="d-flex gap-2">
                    <Button color='primary' size={'sm'} onClick={() => setAdminTab(0)}>Tickets</Button>
                    <Button color='primary' size={'sm'} onClick={() => setAdminTab(1)}>Users</Button>
                  </div>
                </div>
                <div className={`py-4 ${adminTab === 0 ? '' : 'd-none'}`}>
                  <TicketAdmin />
                </div>
                <div className={`py-4 ${adminTab === 1 ? '' : 'd-none'}`}>
                  <UserAdmin />
                </div>
              </div>
            }
          </Col>
        </Row>
      </Container>
    </main>
  )
}