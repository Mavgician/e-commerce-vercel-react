'use client'

function Page() {
  return (
    <main>
      {
      /*
        Lagay niyo dito pinaka layout ng home page for the store. Naka integrate ung bootstrap dito so all goods tayo dun.
        Ang hindi lang nakaintegrate sa root component is ung javascript ng bootstrap. So kung mag ca1ousel or something,
        sabihan niyo ko, kasi medj mahirap iexplain kung paano i allow un - 

        Small explanation:
          Next.js is mostly server-side rendered, ang pag import ng javascript is not "server" friendly. Need nating i-convert
          yung component into a client component para maimport ung javascript. This is actually better para forced tayo gumawa
          ng components for various things on a page. Slideshow component na lalagyan lang ng picture array etc. etc.
        
        Watch niyo rin ung sinend ko sa GC natin para mafamiliarize kayo sa framework. I suggest video number 3 para magets niyo
        ung routing ng pages. Kung paano siya nahahandle ng server ni next.js.

        PAMPADALI TO NG BUHAY NATIN OKAY >:(

        -Mavs ang leader ng bayan
      */
      }
      <h1>You have reached the template page!</h1>
    </main>
  )
}

export default Page