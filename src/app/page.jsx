'use client'
import { TicketItem, TicketLayout } from '@/components/Tickets'
import { SectionHeader, Section } from '@/components/PageLayout'
import { FullWidthCarousel } from '@/components/Carousel'

import { Navigationbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { collection, limit, query } from 'firebase/firestore'
import { db } from '@/scripts/firebase'
import { Loader } from '@/components/Loader'
import { useEffect, useState } from 'react'

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
  const [values, loading, error, snapshot] = useCollectionDataOnce(query(collection(db, 'tickets'), limit(4)));
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!loading) {
      let oldData = [...values]

      for (let i = 0; i < oldData.length; i++) {
        oldData[i].id = snapshot?.docs[i].id
      }

      setData(oldData)
    }
  }, [loading]);

  if (loading) return <Loader/>

  return (
    <>
      <Navigationbar />
      <main>
        <FullWidthCarousel items={items} indicators={true} />
        <Section className="featured-shows p-5">
          <SectionHeader className='text-light'>Featured Shows</SectionHeader>
          <TicketLayout sectionKey={'featuredshows'}>
            {data.map((item, idx) => <TicketItem key={`ticket-${item.ticketid}`} concert_data={item} />)}
          </TicketLayout>
        </Section>
        <Section className="upcoming-events p-5">
          <SectionHeader>Upcoming Shows</SectionHeader>
          <TicketLayout sectionKey={'upcomingshows'}>
            {data.map((item, idx) => <TicketItem key={`ticket-${item.ticketid}`} concert_data={item} />)}
          </TicketLayout>
        </Section>
      </main>
      <Footer />
    </>
  );
}