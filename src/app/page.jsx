'use client'

import { useState } from 'react';
import { Container, Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import { Navigationbar } from "../components/NavigationBar";

const items = [
  {
    src: 'https://images1.smtickets.com/images/carousel_16032024164145.jpg',
  },
  {
    src: 'https://images1.smtickets.com/images/carousel_13032024124818.jpg',
  },
  {
    src: 'https://images1.smtickets.com/images/carousel_26012024193335.jpg',
  }
];

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = items.map((item, index) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={`Slide ${index}`} className="carousel-image" /> 
        <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
      </CarouselItem>
    );
  });

  return (
    <main>
      <div className='NavBar'>
        <Container fluid={true} className='carousel-container'> 
          <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
          </Carousel>
        </Container>
      </div>
      <div className='bodyContent'>
        <h1>CELEBRATING MUSIC</h1>
      </div>
    </main>
  );
}