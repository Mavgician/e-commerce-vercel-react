'use client'

import Link from 'next/link';

import { auth, db } from '@/scripts/firebase';
import { useSignOut } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation'

import {
  Button,
  Container
} from 'reactstrap'

import { UserAuth } from '@/scripts/AuthContextProvider';

import { doc } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';


function Page({ params }) {
  const user = UserAuth()
  const [value, d_loading, d_error, snapshot, reload] = useDocumentDataOnce(doc(db, 'user', params.userid))
  const [signOut, loading, error] = useSignOut(auth);
  const router = useRouter()

  async function logout() {
    await signOut()
    router.push('/')
  }

  if (d_loading) return <main></main>

  if (value.account_type === 'admin') {
    return(
      <main>
        <Container className='p-5'>
          <h1>Hello {user.user?.displayName}</h1>
          <div className='my-3'>
            <h3>Actions:</h3>
            <Button color='danger' size='lg' onClick={logout}>Logout</Button>
            <Link className='btn btn-danger btn-lg ms-3' href={'/admin/add-ticket'}>Add a ticket</Link>
          </div>
          <div className='my-3'>
            <h3>Danger Zone:</h3>
            <Button color='danger' size='lg'>Delete account</Button>
          </div>
        </Container>
      </main>
    )
  } else {
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
  
}

export default Page