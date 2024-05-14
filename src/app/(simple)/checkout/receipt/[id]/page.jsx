'use client'

import { UserAuth } from '@/scripts/AuthContextProvider'
import { db } from '@/scripts/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'

export default function Page({ params }) {
  const [values, loading, error, snapshot] = useDocumentDataOnce(doc(db, 'orders', params.id));
  const searchParams = useSearchParams()

  if (loading) return <main className='d-flex justify-content-center align-items-center'><h1>Processing your order...</h1></main>

  console.log(values);

  return (
    <main className='p-0 py-5 bg-light text-dark d-flex align-items-center justify-content-center'>
      <Container className='p-5 shadow-lg rounded' style={{width: 600}}>
        <div className='lh-1'>
          <h1 className='m-0'>Hi {searchParams.get('c_name')}</h1>
          <h3 className='m-0'>Thank you for your order!</h3>
        </div>
        <h3 className='mt-5'>
          DATE OF ORDER: {new Date().toISOString().slice(0, 10)}
        </h3>
        <div>
          <p className='m-0'>Order ID: {params.id}</p>
          <p className='m-0'>Order class: Online store</p>
          <p className='m-0'>Mode of payment: {values.payment.mode}</p>
          <p className="m-0">Claim Type: {values.claim_type}</p>
        </div>
        <hr />
        <h5>Order Details</h5>
        <hr />
        <div className='d-flex justify-content-end mb-5'>
          <div style={{ width: 300 }}>
            <Row>
              <Col>
                <p className='m-0'>Subtotal</p>
                <p className='m-0'>VAT included</p>
              </Col>
              <Col className='fw-bold'>
                <p className='m-0'>PHP {values.payment.amount}</p>
                <p className='m-0'>PHP 0</p>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <p className='m-0'>Order Total</p>
              </Col>
              <Col className='fw-bold'>
                <p className='m-0 fs-4'>PHP {values.payment.amount}</p>
              </Col>
            </Row>
          </div>
        </div>
        <Link href={'/'} replace={true} className='btn btn-primary'>Go back</Link>
      </Container>
    </main>
  )
}