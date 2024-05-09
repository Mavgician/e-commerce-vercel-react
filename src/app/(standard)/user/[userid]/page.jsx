'use client'

import { auth } from '@/scripts/firebase';

import { useSignOut } from 'react-firebase-hooks/auth';

import { useRouter } from 'next/navigation'

import {
  Button,
  Container
} from 'reactstrap'
import { UserAuth } from '@/scripts/AuthContextProvider';

function Page({ params }) {
  const user = UserAuth()

  const [signOut, loading, error] = useSignOut(auth);
  const router = useRouter()

  async function logout() {
    await signOut()
    router.push('/')
  }

  return (
    <main>
      <Container className='p-5'>
        <h1>Hello {user.user?.displayName}</h1>
        <div className='my-3'>
          <h3>Actions:</h3>
          <Button color='danger' size='lg' onClick={logout}>Logout</Button>
        </div>
        <div className='my-3'>
          <h3>Danger Zone:</h3>
          <Button color='danger' size='lg'>Delete account</Button>
        </div>
      </Container>
    </main>
  )
}

export default Page