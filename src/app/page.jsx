"use client";

import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

import { Navigationbar } from "@/components/Navigation";
import { TicketItem, TicketLayout } from '@/components/Tickets'
import { SectionHeader } from '@/components/PageLayout'
import { FullWidthCarousel } from '@/components/Carousel'

const items = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/conflix-567b2.appspot.com/o/demo-images%2Fhomepage%2Fcarousel1.jpg?alt=media&token=94cc3109-0494-45b3-b410-5903853bbb8f",
    caption: "test",
    header: "test-header",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/conflix-567b2.appspot.com/o/demo-images%2Fhomepage%2Fcarousel2.jpg?alt=media&token=fba70b5b-ee67-4687-a90f-007ec054d313",
    caption: "test",
    header: "test-header",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/conflix-567b2.appspot.com/o/demo-images%2Fhomepage%2Fcarousel3.jpg?alt=media&token=41fdaad3-e47c-4f08-9497-fb5fbf2eb4dd",
    caption: "test",
    header: "test-header",
  },
];

const concerts = [
  {
    title: 'Awesome name for an awesome concert',
    imageurl: 'https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg',
    date: {
      date: 'April 26, 2024',
      time: '8pm'
    },
    location: 'New Frontier Theatre',
    ticketid: 9918
  },
  {
    title: 'Awesome name for an awesome concert',
    imageurl: 'https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg',
    date: {
      date: 'April 26, 2024',
      time: '8pm'
    },
    location: 'New Frontier Theatre',
    ticketid: 1124
  },
  {
    title: 'Awesome name for an awesome concert',
    imageurl: 'https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg',
    date: {
      date: 'April 26, 2024',
      time: '8pm'
    },
    location: 'New Frontier Theatre',
    ticketid: 4213
  }
]

const upcomingconcerts = [
  {
    title: 'Awesome name for an upcoming awesome concert',
    imageurl: 'https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg',
    date: {
      date: 'April 26, 2024',
      time: '8pm'
    },
    location: 'New Frontier Theatre',
    ticketid: 4216
  },
  {
    title: 'Awesome name for an upcoming awesome concert',
    imageurl: 'https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg',
    date: {
      date: 'April 26, 2024',
      time: '8pm'
    },
    location: 'New Frontier Theatre',
    ticketid: 7654
  },
  {
    title: 'Awesome name for an upcoming awesome concert',
    imageurl: 'https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg',
    date: {
      date: 'April 26, 2024',
      time: '8pm'
    },
    location: 'New Frontier Theatre',
    ticketid: 5114
  }
]

export default function Page() {
  return (
    <main>
      <Navigationbar />
      <div className="NavBar">
        <FullWidthCarousel items={items} indicators={true}/>
      </div>
      <div className="bodyContent">
        <div className="featured-shows">
          <SectionHeader>Featured Shows</SectionHeader>
          <TicketLayout sectionKey={'featuredshows'}>
            {concerts.map((item, idx) => <TicketItem key={`ticket-${item.ticketid}`} concert_data={item}/>)}
          </TicketLayout>
        </div>
        <div className="upcoming-events">
          <SectionHeader>Upcoming Shows</SectionHeader>
          <TicketLayout sectionKey={'featuredshows'}>
            {upcomingconcerts.map((item, idx) => <TicketItem key={`ticket-${item.ticketid}`} concert_data={item}/>)}
          </TicketLayout>
        </div>
        <div className="footer">
          <MDBFooter
            bgColor="light"
            className="text-center text-lg-start text-muted"
          >
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom"></section>

            <section className="">
              <MDBContainer className="text-center text-md-start mt-5">
                <MDBRow className="mt-3">
                  <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">
                      <MDBIcon icon="gem" className="me-3" />
                      ConFlix Online
                    </h6>
                    <p>
                      Here you can use rows and columns to organize your footer
                      content. Lorem ipsum dolor sit amet, consectetur
                      adipisicing elit.
                    </p>
                  </MDBCol>
                  <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">Products</h6>
                    <p>
                      <a href="#!" className="text-reset">
                        About Us
                      </a>
                    </p>
                    <p>
                      <a href="#!" className="text-reset">
                        Events
                      </a>
                    </p>
                    <p>
                      <a href="#!" className="text-reset">
                        Tickets
                      </a>
                    </p>
                  </MDBCol>
                  <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">
                      Useful links
                    </h6>
                    <p>
                      <a href="#!" className="text-reset">
                        Pricing
                      </a>
                    </p>
                    <p>
                      <a href="#!" className="text-reset">
                        Settings
                      </a>
                    </p>
                    <p>
                      <a href="#!" className="text-reset">
                        Orders
                      </a>
                    </p>
                    <p>
                      <a href="#!" className="text-reset">
                        Help
                      </a>
                    </p>
                  </MDBCol>
                  <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                    <p>
                      <MDBIcon icon="home" className="me-2" />
                      New York, NY 10012, US
                    </p>
                    <p>
                      <MDBIcon icon="envelope" className="me-3" />
                      info@example.com
                    </p>
                    <p>
                      <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
                    </p>
                    <p>
                      <MDBIcon icon="print" className="me-3" /> + 01 234 567 89
                    </p>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </section>
            <div
              className="text-center p-4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
            >
              © 2024 Copyright:
              <a className="text-reset fw-bold" href="#">
                ConFlix.com
              </a>
            </div>
          </MDBFooter>
        </div>
      </div>
    </main>
  );
}