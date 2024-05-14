'use client'

import {
  Button,
  FormGroup,
  Form,
  Label,
  Input,
  Container
} from 'reactstrap'

import { db } from '@/scripts/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page({ params }) {
  const [username, setUsername] = useState('');
  const router = useRouter()

  async function submitHandler() {
    let user = (await getDoc(doc(db, 'user', params.uid))).data()

    user.d_name = username

    await setDoc(doc(db, 'user', params.uid), user)
    router.push('/')
  }

  return (
    <main className='p-0 position-relative bg-light text-dark'>
      <Container className='vh-100 vw-100 d-flex justify-content-center align-items-center'>
        <Form onKeyDown={event => { 
          if (event.key === "Enter") {
            event.preventDefault()
            submitHandler()
          }
         }}>
          <h1 className='mb-4'>Make an account with ConFlix</h1>
          <FormGroup floating>
            <Input
              placeholder='Username'
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Label>
              Username
            </Label>
          </FormGroup>
          <Button className='my-3' block onClick={submitHandler}>
            Complete Account
          </Button>
        </Form>
      </Container>
    </main>
  )
}