"use client";

import { useState } from 'react';
import { Container, Carousel, CarouselItem, CarouselIndicators, CarouselCaption } from 'reactstrap';

import Image from 'next/image'

const items = [
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/conflix-567b2.appspot.com/o/demo-images%2Fhomepage%2Fcarousel1.jpg?alt=media&token=94cc3109-0494-45b3-b410-5903853bbb8f',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/conflix-567b2.appspot.com/o/demo-images%2Fhomepage%2Fcarousel2.jpg?alt=media&token=fba70b5b-ee67-4687-a90f-007ec054d313',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/conflix-567b2.appspot.com/o/demo-images%2Fhomepage%2Fcarousel3.jpg?alt=media&token=41fdaad3-e47c-4f08-9497-fb5fbf2eb4dd',
  }
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
        <Image src={item.src} alt={`Slide ${index}`} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }}/>
        <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
      </CarouselItem>
    );
  });

  return (
    <main>
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
      <div className='bodyContent'>
        <h1>CELEBRATING MUSIC</h1>
      </div>
    </main>
  );
}
