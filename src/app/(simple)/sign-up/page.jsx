'use client'

import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useSignInWithGoogle, useSignInWithFacebook, useSignOut, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import {
  Button,
  FormGroup,
  Form,
  Label,
  Input,
  Row,
  Col,
  Container
} from 'reactstrap'

import { auth, db } from '@/scripts/firebase'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function Page() {
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invalid, setInvalid] = useState(false);

  const router = useRouter()

  async function submitHandler() {
    if (password !== confirmPassword || password.length === 0 || password.length < 8) return setInvalid(true)
    setInvalid(false)

    console.log(email, password);

    let test = await createUserWithEmailAndPassword(email, password)
    console.log(test);
  }

  useEffect(() => {
    (
      async () => {
        if (user) {
          console.log(user);
          /* await setDoc(doc(db, 'user', user.user.uid), {
            d_name: user.user.displayName,
            email: user.user.email,
            account_type: 'user',
            account_image: user.user.photoURL
          }) */
          /* router.replace('/') */
        }
      }
    )()
  }, [loading]);


  return (
    <main className='p-0 position-relative'>
      <Container className='vh-100 vw-100 d-flex justify-content-center align-items-center'>
        <div>
          <Form onSubmit={e => {
            e.preventDefault()
            submitHandler()
          }}>
            <center>
              <h1 className='mb-4'>Make an account with ConFlix</h1>
              <FormGroup floating>
                <Input
                  placeholder='Email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Label>
                  Email
                </Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  placeholder='Password'
                  type='password'
                  value={password}
                  invalid={invalid}
                  onChange={e => setPassword(e.target.value)}
                />
                <Label>
                  Password
                </Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  placeholder='Password'
                  type='password'
                  value={confirmPassword}
                  invalid={invalid}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <Label>
                  Confirm Password
                </Label>
              </FormGroup>
            </center>
            <FormGroup>
              <Input
                type='checkbox'
              />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Label>
                I agree with the terms and conditions
              </Label>
            </FormGroup>
            <div className='my-3'>
              <Button block onClick={submitHandler}>
                Sign Up
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </main>
  )
}