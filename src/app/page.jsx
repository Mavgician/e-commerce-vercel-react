"use client";

import { useState } from "react";
import {
  Container,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import { Navigationbar } from "./components/NavigationBar";
import { Footer } from "./components/FooterBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
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

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item, index) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={`Slide ${index}`} className="carousel-image" />
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        />
      </CarouselItem>
    );
  });

  return (
    <main>
      <Navigationbar />
      <div className="NavBar">
        <Container fluid={true} className="carousel-container">
          <Carousel activeIndex={activeIndex} next={next} previous={previous}>
            <CarouselIndicators
              items={items}
              activeIndex={activeIndex}
              onClickHandler={goToIndex}
            />
            {slides}
          </Carousel>
        </Container>
      </div>
      <div className="bodyContent">
        <div className="featured-shows">
          <div className="col-lg-12">
            <div
              className="section-title text-lg-left"
              style={{ height: 67, fontWeight: "bold", color: "white" }}
            >
              <span className="sub-title">ConFlix Online</span>
              <h2 className="title">Featured Shows</h2>
            </div>
          </div>
          <div className="row">
            <div className="concert col-xl-3 col-lg-4 col-sm-6">
              <div className="concert-poster">
                <img
                  src="https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg"
                  alt=""
                />
              </div>
              <div className="concert-content">
                <div className="top-content text-light">
                  <h6 className="title">
                    <a href="#">
                      ELECTRIC YOUTH 35TH ANNIVERSARY SHOW, AN EVENING WITH
                      DEBBIE
                    </a>
                  </h6>
                </div>
                <div className="bottom-content">
                  <ul className="content-desc" style={{ marginBottom: 10 }}>
                    <li className="text-white">
                      <span className="duration">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          style={{ color: "#ff0000" }}
                        />{" "}
                        April 26, 2024
                      </span>
                    </li>
                    <li className="text-white">
                      <span className="duration">
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ color: "#ff0000" }}
                        />{" "}
                        8PM
                      </span>
                    </li>
                    <li>
                      <span className="address text-white">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          style={{ color: "#ff0000" }}
                        />{" "}
                        NEW FRONTIER THEATRE
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="concert col-xl-3 col-lg-4 col-sm-6">
              <div className="concert-poster">
                <img
                  src="https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg"
                  alt=""
                />
              </div>
              <div className="concert-content">
                <div className="top-content text-light">
                  <h6 className="title">
                    <a href="#">
                      ELECTRIC YOUTH 35TH ANNIVERSARY SHOW, AN EVENING WITH
                      DEBBIE
                    </a>
                  </h6>
                </div>
                <div className="bottom-content">
                  <ul className="content-desc" style={{ marginBottom: 10 }}>
                    <li className="text-white">
                      <span className="duration">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          style={{ color: "#ff0000" }}
                        />{" "}
                        April 26, 2024
                      </span>
                    </li>
                    <li className="text-white">
                      <span className="duration">
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ color: "#ff0000" }}
                        />{" "}
                        8PM
                      </span>
                    </li>
                    <li>
                      <span className="address text-white">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          style={{ color: "#ff0000" }}
                        />{" "}
                        NEW FRONTIER THEATRE
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="upcoming-events">
          <div className="col-lg-12">
            <div
              className="section-title text-lg-center text-light"
              style={{ height: 67, fontWeight: "bold" }}
            >
              <span className="sub-title">ConFlix Online</span>
              <h2 className="title">Upcoming Events</h2>
            </div>
            <div className="row">
              <div className="concert col-xl-3 col-lg-4 col-sm-6">
                <div className="concert-poster">
                  <img
                    src="https://ticketnetonline.s3.ap-southeast-1.amazonaws.com/files/events/poster/DebbiGibsonEventPoster.jpg"
                    alt=""
                  />
                </div>
                <div className="concert-content">
                  <div className="top-content text-light">
                    <h6 className="title">
                      <a href="#">
                        ELECTRIC YOUTH 35TH ANNIVERSARY SHOW, AN EVENING WITH
                        DEBBIE
                      </a>
                    </h6>
                  </div>
                  <div className="bottom-content">
                    <ul className="content-desc" style={{ marginBottom: 10 }}>
                      <li className="text-white">
                        <span className="duration">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            style={{ color: "#ff0000" }}
                          />{" "}
                          April 26, 2024
                        </span>
                      </li>
                      <li className="text-white">
                        <span className="duration">
                          <FontAwesomeIcon
                            icon={faClock}
                            style={{ color: "#ff0000" }}
                          />{" "}
                          8PM
                        </span>
                      </li>
                      <li>
                        <span className="address text-white">
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            style={{ color: "#ff0000" }}
                          />{" "}
                          NEW FRONTIER THEATRE
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
