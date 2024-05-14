'use client'

import { Loader } from "@/components/Loader";
import { TicketItem, TicketLayout } from "@/components/Tickets";
import { db } from "@/scripts/firebase";
import { collection } from "firebase/firestore";

import { useEffect, useState } from "react";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

import {
  Container,
  Row,
  Col
} from "reactstrap";

import Image from "next/image";
import Link from "next/link";

/* export const metadata = {
  title: 'ConFlix - Tickets',
  description: 'Ticket reseller for concerts',
}; */

function Page() {
  const [values, loading, error, snapshot] = useCollectionDataOnce(collection(db, 'tickets'));
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!loading) {
      let oldData = [...values]

      for (let i = 0; i < oldData.length; i++) {
        oldData[i].id = snapshot?.docs[i].id
      }

      setData(oldData)
    }
  }, [loading]);

  if (loading) return <Loader />

  return (
    <main>
      <Container className="d-flex align-items-center justify-content-center position-relative" fluid style={{ height: '75vh'}}>
        <div className="w-100 h-100 position-absolute top-0 start-0" style={{background: `url('${values[0]?.poster_image_url}')`, backgroundSize: 'cover', filter: 'brightness(0.3)'}}></div>
        <Row className="position-relative">
          <Col className="d-flex align-items-center justify-content-end" xs={12} sm={12} md={4}>
            <Image src={values[0]?.poster_image_url} alt='' height={0} width={0} sizes="100%" style={{ height: 'auto', width: '100%' }} />
          </Col>
          <Col className="text-white" md={8}>
            <h4 className='m-0'>{values[0]?.title}</h4>
            <h1 className='m-0'>{values[0]?.details?.artist}</h1>
            <p className='m-0 mb-4'>{values[0]?.details?.location}</p>
            <Link href={`/tickets/${values[0].id}`} className='btn btn-outline-danger'>BUY TICKETS NOW!</Link>
          </Col>
        </Row>
      </Container>
      <Container className={'mt-5'}>
        <h1 className="mb-4">Hot!</h1>
        <TicketLayout sectionKey={'hot'}>
          {data.flatMap((item, idx) => <TicketItem key={`ticket-${item.ticketid}`} concert_data={item} />)}
        </TicketLayout>
      </Container>
    </main>
  )
}

export default Page