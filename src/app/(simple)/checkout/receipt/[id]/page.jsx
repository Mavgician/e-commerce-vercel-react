'use client'

import {
    Container,
    Row,
    Col
} from 'reactstrap'

export default function Page({ params }) {
    const price = parseInt(localStorage.getItem('price'))

    return (
        <main className='p-0 py-5 position-relative'>
            <Container className='px-5'>
                <div className='lh-1'>
                    <h1 className='m-0'>Hi NAME</h1>
                    <h3 className='m-0'>Thank you for your order!</h3>
                </div>
                <h3 className='mt-5'>
                    DATE OF ORDER: {new Date().toISOString().slice(0, 10)}
                </h3>
                <div>
                    <p className='m-0'>Order ID: {params.id}</p>
                    <p className='m-0'>Order class: Online store</p>
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
                                <p className='m-0'>PHP {price}</p>
                                <p className='m-0'>PHP 0</p>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <p className='m-0'>Order Total</p>
                            </Col>
                            <Col className='fw-bold'>
                                <p className='m-0 fs-4'>PHP {price}</p>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
        </main>
    )
}