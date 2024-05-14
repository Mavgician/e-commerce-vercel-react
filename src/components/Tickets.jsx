'use client'

import {
  Row,
  Col,
  Container,
  Button
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
    <Link href={`tickets/${concert_data?.id}`} className="concert text-light text-decoration-none" ref={componentroot}>
      <div className="concert-poster">
        <Image src={concert_data?.poster_image_url} width={componentDim.width} height={componentDim.height} style={{ height: 'auto', width: '100%' }} alt={''} />
      </div>
      <Container className='px-4'>
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
                {date.toLocaleDateString('ko-KR')}
              </div>
              <div>
                {`${date.toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit", timeZoneName: 'short' })}`}
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

export function intToLetter(index) {
  let letter = '';
  let repeat = Math.floor(Math.log(index) / Math.log(26));

  if (repeat > 1) {
    letter += intToLetter(index / 26);
  }

  letter += String.fromCharCode((index % 26) + 'A'.charCodeAt(0));

  return letter;
};

export function SeatRenderer({ table, onClick = (index) => {}, callBack = (dim) => {}, disabled = true, className='pb-5', height=120 }) {
  let final_table = [];

  callBack(table)

  for (let i = 0; i < table.column; i++) {
    let column = [];
    for (let x = 0; x < table.row; x++) {
      const seat_index = `${intToLetter(i)}${x + 1}`
      column.push(
        <Button
          className='m-1 border d-flex align-items-center justify-content-center'
          style={{ height: 40, width: 40, flexShrink: 0 }}
          key={seat_index}
          onClick={(e) => {onClick(seat_index )}}
          disabled={disabled}
          outline
        >
          {seat_index}
        </Button>
      );
    }

    final_table.push(
      <div className='d-flex' key={`column-${intToLetter(i)}`}>
        {column}
        {height === 120 && <div
          className='m-1'
          style={{ height: 40, width: 45, flexShrink: 0 }}
        ></div>}
      </div>
    );
  }

  return (
    <div className={`${className}`} style={{ height: height, overflow: 'auto' }}>
      {final_table}
    </div>
  );
}