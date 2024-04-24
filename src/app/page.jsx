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
      <div className="NavBar">
        <FullWidthCarousel items={items} indicators={true} />
      </div>
      <div className="featured-shows p-5">
        <SectionHeader>Featured Shows</SectionHeader>
        <TicketLayout sectionKey={'featuredshows'}>
          {concerts.map((item, idx) => <TicketItem key={`ticket-${item.ticketid}`} concert_data={item} />)}
        </TicketLayout>
      </div>
      <div className="upcoming-events p-5">
        <SectionHeader>Upcoming Shows</SectionHeader>
        <TicketLayout sectionKey={'featuredshows'}>
          {upcomingconcerts.map((item, idx) => <TicketItem key={`ticket-${item.ticketid}`} concert_data={item} />)}
        </TicketLayout>
      </div>
    </main>
  );
}