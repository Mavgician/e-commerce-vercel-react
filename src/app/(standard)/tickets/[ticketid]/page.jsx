'use client'

import Image from "next/image"

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'

import { SectionHeader } from "@/components/PageLayout"
import {
  Container,
  Row,
  Col,
  Button
} from "reactstrap"
import { doc } from "firebase/firestore"
import { db } from "@/scripts/firebase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function Page({ params }) {
  const [values, loading, error, snapshot] = useDocumentDataOnce(doc(db, 'tickets', params.ticketid));
  const date = values?.details?.date.toDate()
  const router = useRouter()

  function buyHandler() {
    router.push(`/checkout/${params.ticketid}`)
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
              <h1>{values?.title}</h1>
              <Button onClick={buyHandler} className="ms-4" outline color="danger">Get tickets</Button>
            </div>
            <h4>{values?.details?.artist}</h4>
            <h4>{values?.details?.location} {date ? `${date.getHours()}:${date.getMinutes()}` : ''}</h4>
            <p>{values?.description}</p>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default Page