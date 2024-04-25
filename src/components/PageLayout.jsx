import {
  Row,
  Col,
  Container
} from 'reactstrap'

export function SectionHeader({ children }) {
  return (
    <Container className='mb-5'>
      <span>ConFlix Online</span>
      <h2>{children}</h2>
    </Container>
  )
}

export function Section({ children, className=null }) {
  return (
    <Container fluid={true} className={className}>
      {children}
    </Container>
  )
}