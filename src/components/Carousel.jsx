import { useState } from "react";

import {
  Carousel,
  CarouselItem,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators,
  Container
} from "reactstrap";

import Image from 'next/image'

const next = (setter, index, listLength) => {
  const nextIndex = index === listLength - 1 ? 0 : index + 1
  setter(nextIndex);
}

const previous = (setter, index, listLength) => {
  const nextIndex = index === 0 ? listLength - 1 : index - 1
  setter(nextIndex);
}

const goToIndex = (newIndex, setter) => {
  setter(newIndex);
};

export function FullWidthCarousel({ items, indicators = false, caption = false, controls=false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const slides = items.map((item, index) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <Image src={item.src} alt={`Slide ${index}`} width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
        { caption ? <CarouselCaption captionText={item.caption} captionHeader={item.caption} /> : null }
      </CarouselItem>
    )
  })

  return (
    <Container fluid={true} className='carousel-container'>
      <Carousel
        activeIndex={activeIndex}
        next={() => {
          if (!animating) next(setActiveIndex, activeIndex, items.length)
        }}
        previous={() => {
          if (!animating) previous(setActiveIndex, activeIndex, items.length)
        }}
      >
        { indicators ? <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={idx => {if (!animating) goToIndex(idx, setActiveIndex)}} /> : null }
        {slides}
        {
          controls ? 
          <>
            <CarouselControl
              direction="prev"
              directionText="Previous"
              onClickHandler={() => {
                if (!animating) previous(setActiveIndex, activeIndex, items.length)
              }}
            />
            <CarouselControl
              direction="next"
              directionText="Next"
              onClickHandler={() => {
                if (!animating) next(setActiveIndex, activeIndex, items.length)
              }}
            />
          </> : null
        }
      </Carousel>
    </Container>
  )
}