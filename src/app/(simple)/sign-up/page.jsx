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
  Container,
  FormFeedback
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

  const [errorMsg_p, setErrorMsg_p] = useState(undefined);
  const [errorMsg_e, setErrorMsg_e] = useState(undefined);

  const router = useRouter()

  async function submitHandler() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    setErrorMsg_e(undefined)
    setErrorMsg_p(undefined)
    
    if (password !== confirmPassword) setErrorMsg_p('Passwords do not match.')
    if (password.length < 8) setErrorMsg_p(`Please use at least 8 characters (you are currently using ${password.length} characters).`)
    if (password.length === 0) setErrorMsg_p('Please provide a password.')

    if (!emailRegex.test(email)) setErrorMsg_e('Invalid email.')
    if (email.length === 0) setErrorMsg_e('Please provide an email.')
    
    if (errorMsg_e || errorMsg_p) return 0
    
    await createUserWithEmailAndPassword(email, password)
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
          <Form onKeyDown={event => { if (event.key === "Enter") submitHandler() }}>
            <center>
              <h1 className='mb-4'>Make an account with ConFlix</h1>
              <FormGroup floating>
                <Input
                  placeholder='Email'
                  type='email'
                  value={email}
                  invalid={typeof errorMsg_e === 'string'}
                  onChange={e => setEmail(e.target.value)}
                />
                <Label>
                  Email
                </Label>
                <FormFeedback>{errorMsg_e}</FormFeedback>
              </FormGroup>
              <FormGroup floating>
                <Input
                  placeholder='Password'
                  type='password'
                  value={password}
                  invalid={typeof errorMsg_p === 'string'}
                  onChange={e => setPassword(e.target.value)}
                />
                <Label>
                  Password
                </Label>
                <FormFeedback>{errorMsg_p}</FormFeedback>
              </FormGroup>
              <FormGroup floating>
                <Input
                  placeholder='Password'
                  type='password'
                  value={confirmPassword}
                  invalid={typeof errorMsg_p === 'string'}
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