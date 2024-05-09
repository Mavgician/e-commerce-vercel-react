'use client'

import {
  Row,
  Col,
  Container
} from 'reactstrap'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import {useRef, useEffect, useState } from 'react' 

import Link from 'next/link'
import Image from 'next/image'

export function TicketItem({concert_data}) {
  const componentroot = useRef()
  const [componentDim, setComponentDim] = useState({width: 0, height: 0})
  const date = concert_data?.details?.date.toDate()

  useEffect(() => {
    let dimensions = componentroot.current.getBoundingClientRect()

    setComponentDim({
      width: dimensions.width,
      height: dimensions.height
    })
  }, [])

  return (
    <Link href={`tickets/${concert_data?.id}`} className="concert text-light" ref={componentroot}>
      <div className="concert-poster">
        <Image src={concert_data?.poster_image_url} width={componentDim.width} height={componentDim.height} style={{ height: 'auto', width: '100%' }} alt={''} />
      </div>
      <Container>
        <div className="concert-title text-light">
          <b>{concert_data?.title}</b>
        </div>
        <div>
          <Row>
            <Col md={2} s={2} xs={2}>
              <div>
                <FontAwesomeIcon
                  icon={faCalendar}
                />
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faClock}
                />
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faLocationDot}
                />
              </div>
            </Col>
            <Col md={10} s={10} xs={10}>
              <div>
                {date.toLocaleDateString()}
              </div>
              <div>
                {`${date.getHours()}:${date.getMinutes()}`}
              </div>
              <div>
                {concert_data?.details?.location}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </Link>
  )
}

export function TicketLayout({children, className={}, sectionKey}) {
  try {
    return (
      <Container className={`${className === null ? '' : className}`}>
        <Row>
          {children.map((child, idx) => <Col md={6} lg={4} xl={3} key={`${sectionKey}-${idx}`}>{child}</Col>)}
        </Row>
      </Container>
    )
  } catch (e) {
    if (e instanceof TypeError) {
      return (
        <Container className={`${className === null ? '' : className}`}>
          <h1>no shows available</h1>
        </Container>
      )
    }
  }
  
}